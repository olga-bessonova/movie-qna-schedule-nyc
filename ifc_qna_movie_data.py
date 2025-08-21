import random
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime, date
from logger import get_logger 
from user_agents import USER_AGENTS

logger = get_logger()

CURRENT_DATE = datetime.today()
logger.info(f"Current date {CURRENT_DATE}")

MONTHS = {m: i for i, m in enumerate(
    ["January","February","March","April","May","June","July","August","September","October","November","December"], 1
)}

WEEKDAYS_RE = r"(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)"
MONTHS_RE = r"(January|February|March|April|May|June|July|August|September|October|November|December)"

# Regex: matches "Wednesday, September 17", "September 17", "September 17, 2025"
DATE_MATCH = rf"(?:{WEEKDAYS_RE},?\s+)?{MONTHS_RE}\s+(\d{{1,2}})(?:,\s*(\d{{4}}))?"
# Regex: matches "September 17 and 18" (month once, two days)
MONTH_WITH_TWO_DAYS = rf"{MONTHS_RE}\s+(\d{{1,2}})\s*(?:,)?\s*(?:and|&)\s*(\d{{1,2}})(?:,\s*(\d{{4}}))?"
# Regex: matches ranges like "August 4 - August 25, 2025"
DATE_RANGE = rf"(?:{WEEKDAYS_RE},?\s+)?{MONTHS_RE}\s+(\d{{1,2}})\s*[-–]\s*(?:{WEEKDAYS_RE},?\s+)?{MONTHS_RE}?\s*(\d{{1,2}})(?:,\s*(\d{{4}}))?"

def ifc_qna_movie_data(url):
    try:
        response = requests.get(url, headers={"User-Agent": random.choice(USER_AGENTS)})
        response.raise_for_status()
        logger.info(f"Successfully fetched {url}")
        soup = BeautifulSoup(response.text, "html.parser")
    
        # Extract all paragraphs
        paragraphs = paragraphs_all(soup, url)
        paragraphs_qna = paragraphs_with_qna(paragraphs)
        if paragraphs_qna:
            dates = extract_dates_from_text(paragraphs_qna)
            if dates:
                logger.info(f"Found dates {dates} in {url}")
                # Continue with this movie url only if screenings are upcoming (not in the past):
                image_url = ""
                runtime = ''
                if screenings_upcoming(paragraphs, dates, url):
                    # Find image url
                    img = soup.find("img", class_="film-featured")
                    if img and img.has_attr("src"):
                        image_url = img["src"]
                    else:
                        image_url = "/src/assets/ifc_logo.png"
                    
                    # Find runtime:
                    for li in soup.select("ul.film-details li"):
                        txt = li.get_text(" ", strip=True)
                        if "Running Time" in txt:
                            match = re.search(r"(\d+)\s*minutes?", txt, re.IGNORECASE)
                            if match:
                                minutes = int(match.group(1))   # total minutes as int
                                hours = minutes // 60
                                mins = minutes % 60
                                if hours > 0 and mins > 0:
                                    runtime = f"{hours} HR {mins} MIN"
                                elif hours > 0:
                                    runtime = f"{hours} HR"
                                else:
                                    runtime = f"{mins} MIN"

                                logger.info(f"Running Time: {runtime}")
                            else:
                                logger.warning(f"Running Time has unusual format {txt}")

                    return {
                        "image_url": image_url,
                        "dates": ",".join(d.isoformat() for d in dates),
                        "paragraphs_qna": paragraphs_qna,
                        "runtime": runtime
                    }
                else:
                    logger.info(f"Q&A movie has passed {url}")
                    return None
            else:
                logger.warning(f"Q&A Paragraphs have no dates {url}")
                return None
        else:
            logger.info(f"No Q&A found {url}") 
            return None
                  
            
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error {e.response.status_code} for {url}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for {url}: {e}")

def paragraphs_all(soup: BeautifulSoup, url: str = ''):
    paragraphs = []
    for p in soup.find_all("p"):
        txt = p.get_text(" ", strip=True)
        txt = clean_text(txt)
        if txt:
            paragraphs.append(txt)
    if not paragraphs:
        logger.warning(f"No paragraphs found in {url}")
    return paragraphs

def paragraphs_with_qna(paragraphs):
    paragraphs_qna = []
    for p in paragraphs:
        # match "Q&A" or "Q&amp;A" or "Q & A"
        if re.search(r"q\s*&?\s*a", p, re.IGNORECASE):
            paragraphs_qna.append(p)
    return paragraphs_qna

def extract_dates_from_text(paragraphs_qna):
    dates = []
    for p in paragraphs_qna:
        # Pattern: "August 4 - August 25, 2025"
        for m in re.finditer(DATE_RANGE, p, flags=re.IGNORECASE):
            month1_name = m.group(1)
            d1 = int(m.group(2))
            month2_name = m.group(3) or month1_name  # if 2nd month missing, reuse first
            d2 = int(m.group(4))
            y = m.group(5)
            year = int(y) if y else CURRENT_DATE.year

            month1 = MONTHS[month1_name.capitalize()]
            month2 = MONTHS[month2_name.capitalize()]
            try:
                dates.append(date(year, month1, d1))
                dates.append(date(year, month2, d2))
            except ValueError:
                pass  # skip bad dates

        # Pattern: "September 17 and 18"
        for m in re.finditer(MONTH_WITH_TWO_DAYS, p, flags=re.IGNORECASE):
            month_name = m.group(1)
            d1 = int(m.group(2))
            d2 = int(m.group(3))
            y = m.group(4)
            year = int(y) if y else CURRENT_DATE.year
            month = MONTHS[month_name.capitalize()]
            for d in (d1, d2):
                try:
                    dates.append(date(year, month, d))
                except ValueError:
                    pass  

        # Pattern: "Wednesday, September 17" or "September 17, 2025"
        for m in re.finditer(DATE_MATCH, p, flags=re.IGNORECASE):
            month_name = m.group(1)
            day_s = m.group(2)
            year_s = m.group(3)
            if not day_s:
                continue
            day_i = int(day_s)
            year = int(year_s) if year_s else CURRENT_DATE.year
            month = MONTHS[month_name.capitalize()]
            dates.append(date(year, month, day_i))

    # Deduplicate & sort
    dates = sorted(set(dates))
    return dates

def extract_years_from_text(paragraphs, url):
    years = set()
    for p in paragraphs:
        found_years = re.findall(r"\b(20[2-9][3-9]|20[3-9]\d)\b", p) # matches 2023-2099
        for y in found_years:
            years.add(int(y))
    if not years:
        logger.warning(f"No years found in {url}")
    return sorted(years)

# Choose only movies that are upcoming (not in the past)
def screenings_upcoming(paragraphs, dates, url):
    # Find all dates in paragraphs 
    years = extract_years_from_text(paragraphs, url)
    if not years:
        logger.warning(f"No years found. Skipping the movie {url}")
    elif years[-1] < CURRENT_DATE.year:
        logger.info(f"{url} movie screening was likely in the past ({years[-1]})")
    else:
        # Continue because the found year is current or upcoming
        return dates[-1] >= CURRENT_DATE.date()

def clean_text(txt: str) -> str:
    # Replace non-breaking spaces and other weird whitespace with normal space
    txt = txt.replace('\xa0', ' ')
    txt = re.sub(r'\s+', ' ', txt)  # collapse multiple spaces
    return txt.strip()

if __name__ == "__main__":
    
    # ifc_qna_movie_data("https://www.ifccenter.com/films/hard-hat-riot/")
    # ifc_qna_movie_data("https://www.ifccenter.com/films/death-taxes/") # example of screenings
    # where Q&A not mentioned in every paragraphs and therefore code misses
    ifc_qna_movie_data("https://www.ifccenter.com/series/milestone-films-a-35th-anniversary-celebration-in-35mm/")


