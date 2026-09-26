"""
Run this once before running the apply scripts.

It opens a real, visible Chromium window. YOU log in by hand -- type your
password, complete 2FA, solve any CAPTCHA yourself. Once you're on the
logged-in homepage, come back to this terminal and press Enter. The script
then saves your session (cookies + local storage) to a local file so the
apply scripts can reuse it without ever seeing your password.

Usage:
    python naukri_login.py
"""
from playwright.sync_api import sync_playwright


def main():
    url = "https://www.naukri.com/nlogin/login"
    out_path = "naukri_state.json"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto(url)

        print(f"\nA browser window is open at {url}")
        print("Log in by hand: password, 2FA, any CAPTCHA -- all of it.")
        input("Once you're on the logged-in homepage, press Enter here to save the session... ")

        context.storage_state(path=out_path)
        print(f"Session saved to {out_path}. Keep this file private -- it's equivalent to being logged in.")
        browser.close()


if __name__ == "__main__":
    main()