import csv
import re
import time
import random
from datetime import datetime, date
import requests
from bs4 import BeautifulSoup

BASE = "https://www.ifccenter.com"
SEARCH = BASE + "/?s=q%26a"

UA_LIST = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
]

MONTHS = {m: i for i, m in enumerate(
    ["January","February","March","April","May","June","July","August","September","October","November","December"], 1
)}

WEEKDAYS_RE = r"(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)"
MONTHS_RE = r"(January|February|March|April|May|June|July|August|September|October|November|December)"
# Matches: "Wednesday, September 17", "September 17", "September 17, 2025"
DATE_ATOM = rf"(?:{WEEKDAYS_RE},?\s+)?{MONTHS_RE}\s+(\d{{1,2}})(?:,\s*(\d{{4}}))?"
# Also handle "September 17 and 18" (month once, two days)
MONTH_WITH_TWO_DAYS = rf"{MONTHS_RE}\s+(\d{{1,2}})\s*(?:,)?\s*(?:and|&)\s*(\d{{1,2}})(?:,\s*(\d{{4}}))?"

def fetch_html(url: str) -> str | None:
    headers = {"User-Agent": random.choice(UA_LIST)}
    try:
        r = requests.get(url, headers=headers, timeout=15)
        r.raise_for_status()
        return r.text
    except requests.RequestException:
        return None

def find_posts_on_search(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    posts = soup.select("div.post a")
    links = []
    for a in posts:
        href = a.get("href")
        if href and href.startswith("http"):
            links.append(href)
        elif href:
            links.append(BASE + href)
    # Deduplicate while preserving order
    seen = set()
    uniq = []
    for u in links:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq

def paragraphs_with_qna(soup: BeautifulSoup) -> list[str]:
    hits = []
    for p in soup.find_all("p"):
        txt = p.get_text(" ", strip=True)
        if not txt:
            continue
        # match "Q&A" or "Q&amp;A" or "Q & A"
        if re.search(r"q\s*&?\s*a", txt, re.IGNORECASE):
            hits.append(txt)
    return hits

def extract_dates_from_text(txt: str, default_year: int) -> list[date]:
    dates: list[date] = []

    # Pattern: "September 17 and 18"
    for m in re.finditer(MONTH_WITH_TWO_DAYS, txt, flags=re.IGNORECASE):
        month_name = m.group(1)
        d1 = int(m.group(2))
        d2 = int(m.group(3))
        y = m.group(4)
        year = int(y) if y else default_year
        month = MONTHS[month_name.capitalize()]
        for d in (d1, d2):
            try:
                dates.append(date(year, month, d))
            except ValueError:
                pass  # skip bad dates

    # Pattern: atomic dates like "Wednesday, September 17" or "September 17, 2025"
    # We need to also catch “... and Thursday, September 18 ...” which will be picked up by this loop.
    for m in re.finditer(DATE_ATOM, txt, flags=re.IGNORECASE):
        month_name = m.group(1)
        day_s = m.group(2)
        year_s = m.group(3)
        if not day_s:
            continue
        day_i = int(day_s)
        year = int(year_s) if year_s else default_year
        month = MONTHS[month_name.capitalize()]
        try:
            dates.append(date(year, month, day_i))
        except ValueError:
            pass

    # Deduplicate & sort
    dates = sorted(set(dates))
    # Handle pattern like "September 17 and 18" where atomic loop might have only caught one:
    # already handled above; union ensures uniqueness
    return dates

def clean_description(soup: BeautifulSoup) -> str:
    # A simple description: the first non-empty <p>
    for p in soup.find_all("p"):
        t = p.get_text(" ", strip=True)
        if t:
            return t
    return ""

def parse_post_page(url: str, today: date) -> dict | None:
    html = fetch_html(url)
    if not html:
        return None
    soup = BeautifulSoup(html, "html.parser")

    # Title
    title_tag = soup.find("h1")
    title = title_tag.get_text(strip=True) if title_tag else url

    # Q&A paragraphs
    qna_paras = paragraphs_with_qna(soup)
    if not qna_paras:
        return None  # skip posts without Q&A mention

    # Try to infer year: prefer a 4-digit year present in any Q&A paragraph; else use current year
    year_match = re.search(r"\b(20\d{2})\b", " ".join(qna_paras))
    default_year = int(year_match.group(1)) if year_match else today.year

    # Extract dates from all Q&A paragraphs
    all_dates: list[date] = []
    for para in qna_paras:
        all_dates.extend(extract_dates_from_text(para, default_year))

    all_dates = sorted(set(all_dates))
    if not all_dates:
        return None

    latest = max(all_dates)
    if latest < today:
        return None  # skip past-only posts

    # Basic description
    description = clean_description(soup)

    return {
        "theater": "IFC Center",
        "title": title,
        "link": url,
        "description": description,
        "qna_paragraphs": " || ".join(qna_paras),  # keep full Q&A text(s)
        "dates_iso": ",".join(d.isoformat() for d in all_dates),
        "latest_date_iso": latest.isoformat(),
    }

def crawl_ifc(max_pages: int = 80, sleep_min=0.5, sleep_max=1.2) -> list[dict]:
    today = date.today()
    shows: list[dict] = []
    page = 1
    while page <= max_pages:
        url = SEARCH if page == 1 else f"{BASE}/page/{page}/?s=q%26a"
        html = fetch_html(url)
        if not html:
            break
        post_links = find_posts_on_search(html)
        if not post_links:
            break

        for link in post_links:
            item = parse_post_page(link, today)
            if item:
                shows.append(item)
            time.sleep(random.uniform(sleep_min, sleep_max))
        page += 1
    # sort by latest upcoming date asc
    shows.sort(key=lambda r: r["latest_date_iso"])
    return shows

def save_csv(rows: list[dict], path="ifc_qna_shows.csv"):
    if not rows:
        print("No rows to write.")
        return
    fieldnames = ["theater","title","link","description","qna_paragraphs","dates_iso","latest_date_iso"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
    print(f"Saved {len(rows)} rows to {path}")

if __name__ == "__main__":
    data = crawl_ifc(max_pages=80)
    save_csv(data, "ifc_qna_shows.csv")
