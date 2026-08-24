"""
Fetch LinkedIn + Naukri jobs via Apify, score against resume skills,
and write the best matches to an Excel file with apply links.

python find_matching_jobs.py
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd
import requests

# Resume profile (matches job_search_dashboard.html)
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

DEFAULT_API_KEY = "apify_api_dvtc41BdMxOSQGhJH5zgKdNtft9B1s2TPxeO"
DEFAULT_KEYWORDS = "React TypeScript Frontend Engineer"
DEFAULT_LOCATION = "Bengaluru"
DEFAULT_EXPERIENCE = "2-5"
DEFAULT_DATE_POSTED = "24h"
MIN_MATCH_SCORE = 25  # keep jobs that meaningfully overlap resume
TOP_N = 40


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


def apply_url(job: dict[str, Any]) -> str:
    url = (
        job.get("jobURL")
        or job.get("jobUrl")
        or job.get("url")
        or job.get("applyUrl")
        or job.get("link")
        or ""
    )
    if not url and job.get("jdURL"):
        jd = str(job["jdURL"])
        url = jd if jd.startswith("http") else f"https://www.naukri.com{jd}"
    return url


def normalize_job(job: dict[str, Any], source: str) -> dict[str, Any] | None:
    url = apply_url(job)
    title = job.get("title") or job.get("jobTitle") or ""
    if not title:
        return None

    skill_score = get_match_score(job)
    score = min(100, skill_score + title_boost(job))
    matched = get_matching_skills(job)

    exp = (
        job.get("experienceLabel")
        or job.get("experience")
        or job.get("minExperience")
        or ""
    )
    if not exp and (job.get("minimumExperience") or job.get("maximumExperience")):
        lo = job.get("minimumExperience") or ""
        hi = job.get("maximumExperience") or ""
        exp = f"{lo}-{hi} Yrs" if lo or hi else ""

    return {
        "Match %": score,
        "Matched skills": ", ".join(matched),
        "Job title": title,
        "Company": job.get("company") or job.get("companyName") or "",
        "Location": job.get("location")
        or job.get("locationLabel")
        or job.get("jobLocation")
        or "",
        "Experience": exp,
        "Salary": job.get("salary")
        or job.get("salaryLabel")
        or job.get("salaryRange")
        or "",
        "Posted": job.get("postedAt") or job.get("datePosted") or job.get("publishedAt") or "",
        "Source": source,
        "Apply link": url,
    }


def run_linkedin(api_key: str, keywords: str, location: str, date_posted: str) -> list[dict]:
    date_map = {
        "24h": "past24Hours",
        "3d": "pastWeek",
        "7d": "pastWeek",
        "30d": "pastMonth",
    }
    url = (
        "https://api.apify.com/v2/acts/curious_coder~linkedin-jobs-scraper/"
        f"run-sync-get-dataset-items?token={api_key}&timeout=300&memory=2048"
    )
    payload = {
        "searchQueries": [f"{keywords} {location}"],
        "location": f"{location}, India",
        "dateSincePosted": date_map.get(date_posted, "past24Hours"),
        "maxResults": 25,
        "proxy": {"useApifyProxy": True},
    }
    print("Fetching LinkedIn jobs...")
    resp = requests.post(url, json=payload, timeout=360)
    if not resp.ok:
        print(f"  LinkedIn failed: HTTP {resp.status_code} — {resp.text[:200]}")
        return []
    data = resp.json()
    jobs = data if isinstance(data, list) else []
    print(f"  LinkedIn: {len(jobs)} jobs")
    return jobs


def run_naukri(api_key: str, keywords: str, location: str, experience: str) -> list[dict]:
    exp_map = {"2-5": "2-5", "0-2": "0-2", "5-8": "5-8", "8+": "8-20"}
    exp_str = exp_map.get(experience, "2-5")
    slug = re.sub(r"[^a-z0-9]+", "-", keywords.lower()).strip("-")
    loc_slug = re.sub(r"[^a-z0-9]+", "-", location.lower()).strip("-")
    naukri_url = (
        f"https://www.naukri.com/{slug}-jobs-in-{loc_slug}"
        f"?experience={exp_str}&jobAge=1"
    )
    url = (
        "https://api.apify.com/v2/acts/epicscrapers~naukri-scraper/"
        f"run-sync-get-dataset-items?token={api_key}&timeout=120&memory=1024"
    )
    payload = {
        "startUrls": [{"url": naukri_url}],
        "maxItems": 40,
        "proxy": {"useApifyProxy": True},
    }
    print("Fetching Naukri jobs...")
    resp = requests.post(url, json=payload, timeout=180)
    if not resp.ok:
        print(f"  Naukri failed: HTTP {resp.status_code} — {resp.text[:200]}")
        return []
    data = resp.json()
    jobs = data if isinstance(data, list) else []
    print(f"  Naukri: {len(jobs)} jobs")
    return jobs


def select_best(jobs: list[dict[str, Any]], min_score: int, top_n: int) -> list[dict[str, Any]]:
    # Dedupe by apply link (or title+company)
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
        # Widen columns for readability; make Apply link column wider
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

        # Hyperlink apply URLs
        for row_idx in range(2, len(df) + 2):
            cell = ws.cell(row=row_idx, column=10)
            url = cell.value
            if url and isinstance(url, str) and url.startswith("http"):
                cell.hyperlink = url
                cell.style = "Hyperlink"

    return path


def main() -> int:
    parser = argparse.ArgumentParser(description="Match jobs to resume and export Excel")
    parser.add_argument("--api-key", default=DEFAULT_API_KEY)
    parser.add_argument("--keywords", default=DEFAULT_KEYWORDS)
    parser.add_argument("--location", default=DEFAULT_LOCATION)
    parser.add_argument("--experience", default=DEFAULT_EXPERIENCE)
    parser.add_argument("--date-posted", default=DEFAULT_DATE_POSTED, choices=["24h", "3d", "7d", "30d"])
    parser.add_argument("--source", default="both", choices=["both", "linkedin", "naukri"])
    parser.add_argument("--min-score", type=int, default=MIN_MATCH_SCORE)
    parser.add_argument("--top", type=int, default=TOP_N)
    parser.add_argument(
        "--out",
        default="",
        help="Output .xlsx path (default: matched_jobs_TIMESTAMP.xlsx in this folder)",
    )
    args = parser.parse_args()

    out = Path(args.out) if args.out else Path(__file__).parent / (
        f"matched_jobs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    )

    print(f"Keywords: {args.keywords}")
    print(f"Location: {args.location} | Experience: {args.experience} | Posted: {args.date_posted}")
    print(f"Source: {args.source} | Min match: {args.min_score}% | Top: {args.top}")
    print()

    raw: list[tuple[dict, str]] = []
    if args.source in ("both", "linkedin"):
        for j in run_linkedin(args.api_key, args.keywords, args.location, args.date_posted):
            raw.append((j, "LinkedIn"))
    if args.source in ("both", "naukri"):
        for j in run_naukri(args.api_key, args.keywords, args.location, args.experience):
            raw.append((j, "Naukri"))

    normalized: list[dict[str, Any]] = []
    for job, source in raw:
        row = normalize_job(job, source)
        if row:
            normalized.append(row)

    best = select_best(normalized, args.min_score, args.top)
    path = write_excel(best, out)

    print()
    print(f"Scraped: {len(normalized)} | Matched (>={args.min_score}%): {len(best)}")
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
