"""Terminal prompt for questions the automation can't answer."""

import sys
import threading
import time


def ask_user(prompt: str, timeout_seconds: int = 120) -> str | None:
    """
    Ask the user a question with a timeout.
    Returns the answer string, or None if timeout/no response.
    """
    print(f"\n{'='*60}")
    print(prompt)
    print(f"{'='*60}")
    print(f"(Timeout in {timeout_seconds}s — press Enter to skip this job)")

    result = [None]
    done = threading.Event()

    def reader():
        try:
            line = sys.stdin.readline()
            result[0] = line.rstrip("\n") if line else None
        except Exception:
            result[0] = None
        finally:
            done.set()

    t = threading.Thread(target=reader, daemon=True)
    t.start()

    done.wait(timeout_seconds)

    if not done.is_set():
        print(f"\n[timeout] No response in {timeout_seconds}s — skipping this question")
        return None

    if result[0] is None or result[0].strip() == "":
        print("[empty] Skipping this question")
        return None

    return result[0].strip()