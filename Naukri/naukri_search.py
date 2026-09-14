"""Search Naukri jobs and apply using Gemini for form answers."""

import argparse
import json
import os
import re
import sys
import time
import urllib.parse

from playwright.sync_api import sync_playwright

from naukri_apply import apply_to_current_job, dismiss_modal
from gemini_client import Gemini, GeminiError
from qa_store import QAStore
from resume_profile import get_or_build_profile

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/128.0.0.0 Safari/537.36"
)

STEALTH_SCRIPT = """
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
window.chrome = { runtime: {} };
"""

# Naukri job list selectors
JOB_LIST_ITEM_SELECTORS = [
    "article.jobTuple",
    "div.jobTuple",
    "div.srp-jobtuple-wrapper",
    "article.srp-jobtuple",
    "div[data-job-id]",
]

JOB_LIST_CONTAINER_SELECTORS = [
    "div.list",
    "div.job-list",
    ".srp-jobtuple-wrapper",
]

JOB_TITLE_SELECTORS = [
    "a.title",
    "a.jobTitle",
    ".jobTuple .title",
    "h2.title a",
]

JOB_COMPANY_SELECTORS = [
    "a.subTitle",
    ".companyName",
    ".jobTuple .subTitle",
    "span.companyName",
]

JOB_LOCATION_SELECTORS = [
    ".location",
    ".jobTuple .location",
    "span.location",
]

APPLICANT_COUNT_SELECTORS = [
    ".applicantCount",
    ".jobTuple .applicantCount",
    "span.applicantCount",
]

APPLY_BUTTON_SELECTORS = [
    'button:has-text("Apply")',
    'a:has-text("Apply")',
    ".apply-button",
    "button.apply-btn",
]


def load_config(path="config.json"):
    if not os.path.exists(path):
        print(f"{path} not found. Create it first.")
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def first_visible(scope, selectors, limit=10):
    for sel in selectors:
        locs = scope.locator(sel)
        try:
            count = locs.count()
        except Exception:
            continue
        for i in range(min(count, limit)):
            loc = locs.nth(i)
            try:
                if loc.is_visible():
                    return loc
            except Exception:
                continue
    return None


def text_of(page, selectors):
    loc = first_visible(page, selectors, limit=3)
    if not loc:
        return ""
    try:
        return (loc.inner_text() or "").strip()
    except Exception:
        return ""


def search_url(keywords, config):
    """Build a Naukri job search URL."""
    params = {
        "k": keywords,
        "l": config.get("location", ""),
    }
    # Experience filter (e.g., 3 for 3 years)
    if config.get("experience"):
        params["experience"] = str(config["experience"])
    # Job age filter: 1 = last 1 day, 3 = last 3 days, 7 = last 7 days, etc.
    if config.get("job_age"):
        params["jobAge"] = str(config["job_age"])
    if config.get("past_24_hours", True):
        params["postedBy"] = "1"  # Last 24 hours (legacy)
    # Naukri uses different URL structure
    return "https://www.naukri.com/jobs?" + urllib.parse.urlencode(params)


def open_jobs_search(page, keywords, config):
    url = search_url(keywords, config)
    print(f"Opening: {url}")
    page.goto(url)
    try:
        page.wait_for_load_state("networkidle", timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(config.get("page_load_wait_ms", 3000))
    print(f"Jobs URL: {page.url}")

    # Apply "Last 1 day" freshness filter via UI
    try:
        # Click the Freshness dropdown
        freshness_btn = page.locator('button:has-text("Freshness"), [data-testid="freshness-filter"], button:has-text("Posted")').first
        if freshness_btn.count() and freshness_btn.is_visible():
            freshness_btn.click()
            page.wait_for_timeout(500)
            # Click "Last 1 day" option
            last_1_day = page.locator('text="Last 1 day", text="Last 24 hours", [data-value="1"]').first
            if last_1_day.count() and last_1_day.is_visible():
                last_1_day.click()
                print("Applied 'Last 1 day' freshness filter")
                page.wait_for_timeout(1500)
    except Exception as e:
        print(f"Could not apply freshness filter via UI: {e}")


def hydrate_cards(page, passes=4):
    """Scroll the results list so occluded cards render, then report the count."""
    container = first_visible(page, JOB_LIST_CONTAINER_SELECTORS, limit=2)
    last = 0
    for _ in range(passes):
        cards = job_cards(page)
        count = cards.count() if cards else 0
        if count and count == last:
            break
        last = count
        if container:
            try:
                container.evaluate("el => el.scrollTo(0, el.scrollHeight)")
            except Exception:
                page.mouse.wheel(0, 1500)
        else:
            page.mouse.wheel(0, 1500)
        page.wait_for_timeout(1200)

    if container:
        try:
            container.evaluate("el => el.scrollTo(0, 0)")
        except Exception:
            pass
    page.wait_for_timeout(800)
    cards = job_cards(page)
    return cards.count() if cards else 0


def job_cards(page):
    for sel in JOB_LIST_ITEM_SELECTORS:
        locs = page.locator(sel)
        try:
            if locs.count() > 0:
                return locs
        except Exception:
            continue
    return None


def applicant_count(page):
    """Parse the applicant count from the job card."""
    for sel in APPLICANT_COUNT_SELECTORS:
        loc = page.locator(sel)
        try:
            for i in range(min(loc.count(), 3)):
                text = (loc.nth(i).inner_text() or "")
                match = re.search(r"(\d+)\s*applicant", text, re.I)
                if match:
                    return int(match.group(1))
        except Exception:
            continue
    return None


def job_context(page):
    return {
        "title": text_of(page, JOB_TITLE_SELECTORS),
        "company": text_of(page, JOB_COMPANY_SELECTORS),
        "location": text_of(page, JOB_LOCATION_SELECTORS),
        "url": page.url,
    }


def already_applied(page):
    for sel in [
        'button:has-text("Applied")',
        'a:has-text("Applied")',
        '.applied',
        'span:has-text("Applied")',
    ]:
        loc = page.locator(sel).first
        try:
            if loc.count() and loc.is_visible():
                return True
        except Exception:
            continue
    return False


def find_apply_button(page):
    """Find the apply button on the job details page."""
    candidates = [
        page.get_by_role("button", name=re.compile(r"Apply", re.I)),
        page.locator('a:has-text("Apply")'),
        page.locator("button.apply-button"),
        page.locator(".apply-btn"),
    ]
    for locs in candidates:
        try:
            count = locs.count()
        except Exception:
            continue
        for i in range(min(count, 5)):
            loc = locs.nth(i)
            try:
                if loc.is_visible() and loc.is_enabled():
                    return loc
            except Exception:
                continue
    return None


def click_apply(page, timeout=20000):
    start = time.time()
    while (time.time() - start) * 1000 < timeout:
        loc = find_apply_button(page)
        if loc:
            loc.scroll_into_view_if_needed()
            try:
                loc.click()
            except Exception:
                loc.evaluate("el => el.click()")
            return True
        page.wait_for_timeout(500)
    return False


def run(config):
    if config.get("keywords_mode", "role") == "template":
        keywords = config["query_template"].format(
            role=config["role"], applicants=config["applicants"]
        )
    else:
        keywords = config["role"]

    max_applicants = int(config.get("applicants") or 0) or None
    max_applications = int(config.get("max_applications", 5))
    resume_path = config.get("resume_path")
    if not resume_path:
        print("Set 'resume_path' in config.json to your resume PDF.")
        sys.exit(1)

    gemini = Gemini(config)
    profile = get_or_build_profile(resume_path, gemini=gemini)
    store = QAStore()
    print(f"Loaded {len(store)} cached question/answer pair(s).")

    if not os.path.exists("naukri_state.json"):
        print("naukri_state.json not found. Run naukri_login.py first.")
        sys.exit(1)

    with sync_playwright() as p:
        launch_kwargs = {
            "headless": bool(config.get("headless", False)),
            "args": [
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
                "--disable-infobars",
                "--no-first-run",
                "--no-default-browser-check",
            ],
        }
        try:
            browser = p.chromium.launch(channel="chrome", **launch_kwargs)
        except Exception:
            browser = p.chromium.launch(**launch_kwargs)

        context = browser.new_context(
            storage_state="naukri_state.json",
            user_agent=USER_AGENT,
            viewport={"width": 1440, "height": 900},
        )
        context.add_init_script(STEALTH_SCRIPT)
        page = context.new_page()

        open_jobs_search(page, keywords, config)

        total = hydrate_cards(page)
        print(f"{total} job card(s) on this page.")
        if not total:
            page.screenshot(path="error_no_cards.png", full_page=True)
            print("No cards found. Saved error_no_cards.png")

        applied = 0
        skipped = 0

        for i in range(total):
            if applied >= max_applications:
                break

            cards = job_cards(page)
            if not cards or i >= cards.count():
                break

            card = cards.nth(i)
            try:
                card.scroll_into_view_if_needed()
                page.wait_for_timeout(500)
                card.click()
            except Exception as e:
                print(f"[{i + 1}] could not open card: {e}")
                continue

            page.wait_for_timeout(2500)
            ctx = job_context(page)
            count = applicant_count(page)
            label = f"{count} applicants" if count is not None else "applicant count unknown"
            print(f"\n[{i + 1}/{total}] {ctx['title']} @ {ctx['company']} ({label})")

            if max_applicants and count is not None and count > max_applicants:
                print(f"  Over the {max_applicants}-applicant cap; skipping.")
                skipped += 1
                continue

            if already_applied(page):
                print("  Already applied; skipping.")
                skipped += 1
                continue

            if not click_apply(page, timeout=8000):
                print("  No Apply button; skipping.")
                skipped += 1
                continue

            try:
                sent = apply_to_current_job(page, gemini, profile, ctx, store=store)
            except GeminiError:
                raise
            except Exception as e:
                print(f"  [error] {e}")
                page.screenshot(path=f"error_apply_{i + 1}.png")
                sent = False

            if sent:
                applied += 1
                print(f"  Applied ({applied}/{max_applications}).")
            else:
                skipped += 1
                print("  Not submitted; moving on.")
                dismiss_modal(page)

            page.wait_for_timeout(2000)
            # Go back to job list
            try:
                page.go_back()
                page.wait_for_timeout(1500)
            except Exception:
                pass

        print(f"\nDone. Applied to {applied} job(s), skipped {skipped}.")
        context.close()
        browser.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("role", nargs="?", help="Override config.json role")
    parser.add_argument("applicants", nargs="?", help="Override config.json applicants")
    parser.add_argument("--max", type=int, help="Override max_applications")
    args = parser.parse_args()

    config = load_config()
    if args.role:
        config["role"] = args.role
    if args.applicants:
        config["applicants"] = args.applicants
    if args.max:
        config["max_applications"] = args.max

    run(config)


if __name__ == "__main__":
    main()