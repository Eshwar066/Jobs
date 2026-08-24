"""
LinkedIn job scraper using Playwright with your Chrome profile.
Uses your existing Chrome session (cookies, login) to fetch recently listed jobs.

https://docs.google.com/spreadsheets/d/1SatVMWfDTiOk6Lh-5s-XKQaAiIWyQY_TYxJlhxdeNy0/edit?gid=0#gid=0

Usage:
    python linkedin_playwright_scraper.py --keywords "React TypeScript" --location "Bengaluru" --date-posted 24h
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import pandas as pd
from playwright.sync_api import sync_playwright

# Resume profile (matches find_matching_jobs.py)
MY_SKILLS = [
    "react",
    "typescript",
    "redux",
    "redux toolkit",
    "module federation",
    "micro-frontend",
    "microfrontend",
    "webpack",
    "webpack 5",
    "javascript",
    "tailwind",
    "zustand",
    "context api",
    "websocket",
    "monorepo",
    "styled components",
    "scss",
    "mui",
    "figma",
    "git",
]

MY_TITLES = [
    "frontend",
    "front-end",
    "front end",
    "react",
    "typescript",
    "ui engineer",
    "sde ii",
    "sde 2",
    "software engineer",
    "ui developer",
]

DEFAULT_KEYWORDS = "React TypeScript Frontend Engineer"
DEFAULT_LOCATION = "Bengaluru"
DEFAULT_DATE_POSTED = "24h"
MIN_MATCH_SCORE = 25
TOP_N = 40

# Chrome user data directory (Windows default)
CHROME_USER_DATA = Path.home() / "AppData" / "Local" / "Google" / "Chrome" / "User Data"
CHROME_PROFILE = "Profile 1"  # Eshwar Sai Ram (eshwarsairam7@gmail.com)


def job_skills(job: dict[str, Any]) -> list[str]:
    skills = job.get("skills") or job.get("tagsAndSkills") or []
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.replace("|", ",").split(",") if s.strip()]
    return [str(s) for s in skills]


def job_text(job: dict[str, Any]) -> str:
    parts = [
        job.get("title") or job.get("jobTitle") or "",
        job.get("description") or job.get("jobDescription") or "",
        " ".join(job_skills(job)),
        job.get("company") or job.get("companyName") or "",
    ]
    return " ".join(parts).lower()


def get_match_score(job: dict[str, Any]) -> int:
    text = job_text(job)
    matches = sum(1 for s in MY_SKILLS if s in text)
    return round((matches / len(MY_SKILLS)) * 100)


def get_matching_skills(job: dict[str, Any]) -> list[str]:
    text = job_text(job)
    return [s for s in MY_SKILLS if s in text]


def title_boost(job: dict[str, Any]) -> int:
    title = (job.get("title") or job.get("jobTitle") or "").lower()
    return 15 if any(t in title for t in MY_TITLES) else 0


def parse_posted_date(posted_str: str) -> datetime | None:
    """Parse LinkedIn relative date strings like '2 hours ago', '3 days ago', etc."""
    if not posted_str:
        return None
    posted_str = posted_str.lower().strip()
    now = datetime.now()

    # Patterns: "X hours ago", "X days ago", "X weeks ago", "X months ago"
    patterns = [
        (r"(\d+)\s*hour", "hours"),
        (r"(\d+)\s*day", "days"),
        (r"(\d+)\s*week", "weeks"),
        (r"(\d+)\s*month", "months"),
    ]
    for pattern, unit in patterns:
        match = re.search(pattern, posted_str)
        if match:
            value = int(match.group(1))
            delta = timedelta(**{unit: value})
            return now - delta

    # "just now", "today"
    if "just now" in posted_str or "today" in posted_str:
        return now

    return None


def filter_by_date(jobs: list[dict], date_posted: str) -> list[dict]:
    """Filter jobs by posted date."""
    date_map = {
        "24h": timedelta(hours=24),
        "3d": timedelta(days=3),
        "7d": timedelta(days=7),
        "30d": timedelta(days=30),
    }
    cutoff = datetime.now() - date_map.get(date_posted, timedelta(hours=24))

    filtered = []
    for job in jobs:
        posted = parse_posted_date(job.get("posted", ""))
        if posted and posted >= cutoff:
            filtered.append(job)
    return filtered


def normalize_job(job: dict[str, Any]) -> dict[str, Any] | None:
    url = job.get("url", "")
    title = job.get("title", "")
    if not title:
        return None

    skill_score = get_match_score(job)
    score = min(100, skill_score + title_boost(job))
    matched = get_matching_skills(job)

    return {
        "Match %": score,
        "Matched skills": ", ".join(matched),
        "Job title": title,
        "Company": job.get("company", ""),
        "Location": job.get("location", ""),
        "Experience": job.get("experience", ""),
        "Salary": job.get("salary", ""),
        "Posted": job.get("posted", ""),
        "Source": "LinkedIn (Playwright)",
        "Apply link": url,
    }


def select_best(jobs: list[dict[str, Any]], min_score: int, top_n: int) -> list[dict[str, Any]]:
    seen: set[str] = set()
    unique: list[dict[str, Any]] = []
    for j in jobs:
        key = (j.get("Apply link") or "").strip().lower() or (
            f"{j.get('Job title','').lower()}|{j.get('Company','').lower()}"
        )
        if key in seen:
            continue
        seen.add(key)
        unique.append(j)

    filtered = [j for j in unique if j["Match %"] >= min_score]
    filtered.sort(key=lambda j: (-j["Match %"], j.get("Job title") or ""))
    return filtered[:top_n]


def write_excel(rows: list[dict[str, Any]], path: Path) -> Path:
    df = pd.DataFrame(rows)
    if df.empty:
        df = pd.DataFrame(
            columns=[
                "Match %",
                "Matched skills",
                "Job title",
                "Company",
                "Location",
                "Experience",
                "Salary",
                "Posted",
                "Source",
                "Apply link",
            ]
        )

    path.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Matching jobs")
        ws = writer.sheets["Matching jobs"]
        widths = {
            "A": 10,
            "B": 36,
            "C": 36,
            "D": 24,
            "E": 18,
            "F": 14,
            "G": 16,
            "H": 16,
            "I": 12,
            "J": 55,
        }
        for col, w in widths.items():
            ws.column_dimensions[col].width = w

        for row_idx in range(2, len(df) + 2):
            cell = ws.cell(row=row_idx, column=10)
            url = cell.value
            if url and isinstance(url, str) and url.startswith("http"):
                cell.hyperlink = url
                cell.style = "Hyperlink"

    return path


def scrape_linkedin_jobs(
    keywords: str,
    location: str,
    date_posted: str,
    max_results: int = 50,
    headless: bool = False,
) -> list[dict]:
    """
    Scrape LinkedIn jobs using Playwright with your Chrome profile.
    """
    # Build search URL
    search_query = f"{keywords} {location}".replace(" ", "%20")
    date_param = {"24h": "r86400", "3d": "r259200", "7d": "r604800", "30d": "r2592000"}.get(date_posted, "r86400")
    url = f"https://www.linkedin.com/jobs/search/?keywords={search_query}&f_TPR={date_param}&position=1&pageNum=0"

    jobs = []

    with sync_playwright() as p:
        # Launch Chrome with your user data directory (preserves login)
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(CHROME_USER_DATA),
            headless=headless,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-first-run",
                "--no-default-browser-check",
            ],
            viewport={"width": 1280, "height": 720},
        )

        page = browser.new_page()

        # Stealth: remove webdriver property
        page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

        print(f"Navigating to: {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=90000)

        # Debug: print current URL and page title
        print(f"  Current URL: {page.url}")
        print(f"  Page title: {page.title()}")

        # Check if redirected to login
        if "login" in page.url or "uas/login" in page.url or "checkpoint" in page.url:
            print("❌ Redirected to LinkedIn login/checkpoint page.")
            print("   Please log into LinkedIn in Chrome (Profile 1) first:")
            print("   1. Open Chrome with Profile 1")
            print("   2. Go to linkedin.com and sign in")
            print("   3. Close Chrome completely")
            print("   4. Re-run this script")
            browser.close()
            return []

        # Wait for job cards to load - try multiple selectors
        for selector in [
            "ul.jobs-search__results-list",
            "ul[role='list']",
            ".jobs-search-results-list",
            "[data-job-id]",
            ".job-card-container",
        ]:
            try:
                page.wait_for_selector(selector, timeout=10000)
                print(f"  Found jobs list with selector: {selector}")
                break
            except:
                continue
        else:
            # Debug: dump page content
            print("  [DEBUG] Could not find job list. Page HTML (first 5000 chars):")
            print(page.content()[:5000])
            browser.close()
            return []

        # Close any modal/overlay that might intercept clicks
        page.evaluate("""() => {
            const overlays = document.querySelectorAll('.modal__overlay, .artdeco-modal-overlay, [role="dialog"]');
            overlays.forEach(el => el.remove());
        }""")

        # Scroll to load more jobs
        last_height = 0
        for _ in range(5):  # Scroll a few times
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(2000)
            new_height = page.evaluate("document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        # Extract job cards - use the data-job-id attribute
        job_cards = page.query_selector_all("[data-job-id]")

        print(f"Found {len(job_cards)} job cards")

        for card in job_cards[:max_results]:
            try:
                # Click to open job details - use force click to bypass overlay
                card.click(force=True)
                page.wait_for_timeout(2000)

                # Extract job details from the right panel
                job_data = {}

                # Title - try multiple selectors
                title_elem = page.query_selector(
                    "h1.t-24, h1.job-title, .job-details-jobs-unified-top-card__job-title, "
                    ".jobs-unified-top-card__job-title, h2.job-title"
                )
                job_data["title"] = title_elem.inner_text().strip() if title_elem else ""

                # Company
                company_elem = page.query_selector(
                    ".job-details-jobs-unified-top-card__company-name, "
                    ".jobs-unified-top-card__company-name a, "
                    ".job-details-jobs-unified-top-card__company-name a"
                )
                job_data["company"] = company_elem.inner_text().strip() if company_elem else ""

                # Location
                location_elem = page.query_selector(
                    ".job-details-jobs-unified-top-card__bullet, "
                    ".jobs-unified-top-card__bullet, "
                    "[data-test-job-location]"
                )
                job_data["location"] = location_elem.inner_text().strip() if location_elem else ""

                # Posted date
                posted_elem = page.query_selector(
                    ".job-details-jobs-unified-top-card__posted-date, "
                    ".jobs-unified-top-card__posted-date, "
                    "[data-test-job-posted-date]"
                )
                job_data["posted"] = posted_elem.inner_text().strip() if posted_elem else ""

                # Job URL
                job_data["url"] = page.url

                # Description
                desc_elem = page.query_selector(
                    ".job-details-jobs-unified-top-card__job-description, "
                    ".jobs-description__content, "
                    "#job-details, "
                    ".jobs-description"
                )
                job_data["description"] = desc_elem.inner_text().strip() if desc_elem else ""

                # Debug output
                print(f"  [DEBUG] title='{job_data['title'][:40]}' company='{job_data['company'][:30]}' posted='{job_data['posted']}'")

                # Try to get experience level and salary from description
                desc_text = job_data["description"].lower()
                exp_patterns = [
                    r"(\d+\+?\s*-\s*\d+\+?\s*years?)",
                    r"(\d+\+?\s*years?\s*experience)",
                    r"(entry.level|senior|lead|principal|staff)",
                ]
                for pattern in exp_patterns:
                    match = re.search(pattern, desc_text)
                    if match:
                        job_data["experience"] = match.group(1)
                        break

                salary_patterns = [
                    r"(\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*-\s*\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*(?:k|K|per year|/year|annually)?)",
                    r"(₹?\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*-\s*₹?\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*(?:lpa|LPA|per annum)?)",
                ]
                for pattern in salary_patterns:
                    match = re.search(pattern, desc_text)
                    if match:
                        job_data["salary"] = match.group(1)
                        break

                # Skills from description
                skills_found = [s for s in MY_SKILLS if s in desc_text]
                job_data["skills"] = skills_found

                if job_data["title"]:
                    jobs.append(job_data)
                    print(f"  [ok] {job_data['title'][:50]} | {job_data['company'][:30]} | {job_data['posted'][:30]}")

            except Exception as e:
                print(f"  [x] Error extracting job: {e}")
                continue

        browser.close()

    return jobs


def main() -> int:
    parser = argparse.ArgumentParser(description="Scrape LinkedIn jobs using Playwright with your Chrome profile")
    parser.add_argument("--keywords", default=DEFAULT_KEYWORDS)
    parser.add_argument("--location", default=DEFAULT_LOCATION)
    parser.add_argument("--date-posted", default=DEFAULT_DATE_POSTED, choices=["24h", "3d", "7d", "30d"])
    parser.add_argument("--max-results", type=int, default=50)
    parser.add_argument("--headless", action="store_true", help="Run in headless mode (no visible browser)")
    parser.add_argument("--min-score", type=int, default=MIN_MATCH_SCORE)
    parser.add_argument("--top", type=int, default=TOP_N)
    parser.add_argument(
        "--out",
        default="",
        help="Output .xlsx path (default: linkedin_jobs_TIMESTAMP.xlsx in this folder)",
    )
    parser.add_argument(
        "--chrome-profile",
        default=CHROME_PROFILE,
        help=f"Chrome profile to use (default: {CHROME_PROFILE})",
    )
    args = parser.parse_args()

    global CHROME_USER_DATA
    CHROME_USER_DATA = CHROME_USER_DATA.parent / "User Data" / args.chrome_profile

    out = Path(args.out) if args.out else Path(__file__).parent / (
        f"linkedin_jobs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    )

    print(f"Keywords: {args.keywords}")
    print(f"Location: {args.location} | Posted: {args.date_posted}")
    print(f"Max results: {args.max_results} | Headless: {args.headless}")
    print(f"Chrome profile: {args.chrome_profile}")
    print(f"Min match: {args.min_score}% | Top: {args.top}")
    print()

    # Check if Chrome profile exists
    if not CHROME_USER_DATA.exists():
        print(f"❌ Chrome profile not found at: {CHROME_USER_DATA}")
        print("   Make sure Chrome is installed and you've logged into LinkedIn.")
        print("   Try: --chrome-profile 'Profile 1' or check your Chrome user data path.")
        return 1

    print("Scraping LinkedIn jobs...")
    raw_jobs = scrape_linkedin_jobs(
        args.keywords,
        args.location,
        args.date_posted,
        args.max_results,
        args.headless,
    )

    print(f"\nScraped {len(raw_jobs)} jobs")

    # Filter by date
    filtered_jobs = filter_by_date(raw_jobs, args.date_posted)
    print(f"After date filter ({args.date_posted}): {len(filtered_jobs)} jobs")

    # Normalize and score
    normalized: list[dict[str, Any]] = []
    for job in filtered_jobs:
        row = normalize_job(job)
        if row:
            normalized.append(row)

    best = select_best(normalized, args.min_score, args.top)
    path = write_excel(best, out)

    print()
    print(f"Normalized: {len(normalized)} | Matched (>={args.min_score}%): {len(best)}")
    print(f"Excel saved: {path.resolve()}")
    if best:
        print("\nTop matches:")
        for j in best[:10]:
            title = (j["Job title"] or "")[:50]
            company = (j["Company"] or "")[:24]
            print(f"  {j['Match %']:3d}% | {title:50s} | {company}")
    else:
        print("No jobs met the match threshold. Try --min-score 15 or a longer date range.")
    return 0


if __name__ == "__main__":
    sys.exit(main())