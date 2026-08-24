"""
Generic Google Sheets writer using Playwright with existing Chrome session.
Reusable across multiple projects.

Usage:
    from gsheets_writer import append_to_gsheets

    rows = [{"Name": "John", "Age": "30"}, {"Name": "Jane", "Age": "25"}]
    url = append_to_gsheets(rows, spreadsheet_id="YOUR_SHEET_ID", gid="TAB_ID")
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright

# Default Chrome profile path (Windows)
CHROME_USER_DATA = Path.home() / "AppData" / "Local" / "Google" / "Chrome" / "User Data"
DEFAULT_CHROME_PROFILE = "Profile 1"


def append_to_gsheets(
    rows: list[dict[str, Any]],
    spreadsheet_id: str,
    gid: str = "0",
    headers: list[str] | None = None,
    chrome_profile: str = DEFAULT_CHROME_PROFILE,
    chrome_user_data: Path | None = None,
    clear_first: bool = False,
) -> str:
    """
    Append rows to a Google Sheet using Playwright with your logged-in Chrome session.

    Args:
        rows: List of dicts to append (each dict = one row)
        spreadsheet_id: Google Sheets ID from URL (e.g., 1abc123...)
        gid: Tab ID from URL (e.g., 806555603), default "0" (first tab)
        headers: Column headers (if None, uses keys from first row)
        chrome_profile: Chrome profile folder name (default: "Profile 1")
        chrome_user_data: Full path to Chrome User Data dir (auto-detected if None)
        clear_first: If True, clears sheet before writing headers + data

    Returns:
        Google Sheets URL
    """
    if not rows:
        return f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit#gid={gid}"

    # Resolve Chrome user data path
    if chrome_user_data is None:
        chrome_user_data = CHROME_USER_DATA.parent / "User Data" / chrome_profile

    sheet_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit#gid={gid}"

    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(chrome_user_data),
            headless=False,  # Google Sheets requires visible browser
            args=["--disable-blink-features=AutomationControlled"],
            viewport={"width": 1280, "height": 720},
        )

        page = browser.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined});")

        print(f"  Opening Google Sheet: {sheet_url}")
        page.goto(sheet_url, wait_until="domcontentloaded", timeout=180000)

        # Wait for sheet to load
        page.wait_for_timeout(5000)
        for selector in ['[role="grid"]', '[data-sheet-id]', '.grid-container', '#docs-editor-container', 'div.sheet-grid']:
            try:
                page.wait_for_selector(selector, timeout=60000)
                print(f"  Sheet loaded (found {selector})")
                break
            except:
                continue
        else:
            print("  Warning: Could not detect sheet grid, continuing anyway...")
        page.wait_for_timeout(3000)

        # Determine headers
        if headers is None:
            headers = list(rows[0].keys())

        # Navigate to A1
        page.keyboard.press("Control+Home")

        # Clear sheet if requested
        if clear_first:
            print("  Clearing existing content...")
            page.keyboard.press("Control+A")
            page.keyboard.press("Delete")
            page.wait_for_timeout(500)
            page.keyboard.press("Control+Home")

        # Check if headers exist (read A1)
        a1_value = page.evaluate("""() => document.querySelector('[role="gridcell"]')?.textContent || ''""")
        has_headers = bool(a1_value and any(h.lower() in a1_value.lower() for h in headers[:3]))

        if not has_headers:
            print("  Writing headers...")
            for i, h in enumerate(headers):
                page.keyboard.type(str(h))
                if i < len(headers) - 1:
                    page.keyboard.press("Tab")
            page.keyboard.press("Enter")
            page.wait_for_timeout(500)

        # Move to first data row (after headers)
        if not has_headers:
            page.keyboard.press("ArrowDown")  # Go to row 2
        else:
            # Find last row with data - go to bottom
            page.keyboard.press("Control+ArrowDown")
            page.keyboard.press("ArrowDown")

        # Write data rows
        print(f"  Writing {len(rows)} rows...")
        for row in rows:
            values = [str(row.get(h, "")) for h in headers]
            for i, val in enumerate(values):
                page.keyboard.type(val)
                if i < len(values) - 1:
                    page.keyboard.press("Tab")
            page.keyboard.press("Enter")
            page.wait_for_timeout(150)

        browser.close()

    return sheet_url


def append_to_gsheets_simple(
    rows: list[dict[str, Any]],
    sheet_url: str,
    chrome_profile: str = DEFAULT_CHROME_PROFILE,
) -> str:
    """
    Simpler interface - pass full sheet URL.

    Args:
        rows: List of dicts to append
        sheet_url: Full Google Sheets URL (e.g., https://docs.google.com/spreadsheets/d/1abc/edit#gid=123)
        chrome_profile: Chrome profile folder name

    Returns:
        The same sheet URL
    """
    # Parse spreadsheet_id and gid from URL
    import re
    match = re.search(r"/d/([a-zA-Z0-9-_]+)/", sheet_url)
    if not match:
        raise ValueError(f"Invalid Google Sheets URL: {sheet_url}")
    spreadsheet_id = match.group(1)

    gid_match = re.search(r"[#&]gid=(\d+)", sheet_url)
    gid = gid_match.group(1) if gid_match else "0"

    return append_to_gsheets(rows, spreadsheet_id, gid, chrome_profile=chrome_profile)


if __name__ == "__main__":
    # Test with sample data
    test_rows = [
        {"Name": "Test User 1", "Email": "test1@example.com", "Score": "85"},
        {"Name": "Test User 2", "Email": "test2@example.com", "Score": "92"},
    ]

    import sys
    if len(sys.argv) > 1:
        sheet_url = sys.argv[1]
        append_to_gsheets_simple(test_rows, sheet_url)
        print(f"Done: {sheet_url}")
    else:
        print("Usage: python gsheets_writer.py \"https://docs.google.com/spreadsheets/d/.../edit#gid=...\"")