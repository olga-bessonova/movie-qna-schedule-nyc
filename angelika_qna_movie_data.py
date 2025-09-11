import time
import re
from datetime import datetime
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from logger import get_logger

logger = get_logger()

CSV_FIELDS = ["theater", "title", "link", "rating", "genre", "runtime", "language", "description", "image_url", 
              "date", 
              "qa_notes"]

def angelika_qna_movie_data(driver, film):

    try:
        logger.info(f"Opening link: {film['link']}")
        driver.get(film["link"])
        time.sleep(3)

        # Rating
        try:
            rating_div = driver.find_element(By.CSS_SELECTOR, "div.film-rating-wrapper img.rating").find_element(By.XPATH, "..")
            rating = rating_div.get_attribute("textContent").strip()
            logger.info(f"Found rating: {rating}")
        except Exception as e:
            rating = "No rating"
            logger.warning(f"No rating found for {film.get('title', '')} ({e})")

        # Genre
        try:
            genre_div = driver.find_element(By.CSS_SELECTOR, "div.film-rating-wrapper img.genre").find_element(By.XPATH, "..")
            genre = genre_div.get_attribute("textContent").strip()
            logger.info(f"Found genre: {genre}")
        except Exception as e:
            genre = "No genre"
            logger.warning(f"No genre found for {film.get('title', '')} ({e})")

        # Description
        try:
            desc_div = driver.find_element(By.CSS_SELECTOR, "div.film-pg-content-desc")
            description = desc_div.get_attribute("textContent").strip()
            logger.info(f"Found description length: {len(description)} chars")
        except Exception as e:
            description = "No description"
            logger.warning(f"No description found for {film.get('title', '')} ({e})")

        # Runtime
        try:
            runtime_div = driver.find_element(By.CSS_SELECTOR, "div.film-rating-wrapper img.duration").find_element(By.XPATH, "..")
            runtime_raw = runtime_div.get_attribute("textContent").strip()

            # Extract numbers
            match = re.match(r"(?:(\d+)\s*hour[s]?)?(?:\s*and\s*)?(?:(\d+)\s*minute[s]?)?", runtime_raw, re.IGNORECASE)
            if match:
                hours = match.group(1)
                minutes = match.group(2)
                parts = []
                if hours:
                    parts.append(f"{hours} H")
                if minutes:
                    parts.append(f"{minutes} MIN")
                runtime = " ".join(parts)
            else:
                runtime = runtime_raw  # fallback if regex fails

            logger.info(f"Found runtime: {runtime}")

        except Exception as e:
            runtime = "No runtime"
            logger.warning(f"No runtime found for {film.get('title', '')} ({e})")

        # Language
        try:
            lang_div = driver.find_element(By.CSS_SELECTOR, "div.film-rating-wrapper img.language").find_element(By.XPATH, "..")
            language = lang_div.get_attribute("textContent").strip()
            logger.info(f"Found language: {language}")
        except Exception as e:
            language = "No language"
            logger.warning(f"No language found for {film.get('title', '')} ({e})")

        # Q&A notes
        try:
            note_divs = driver.find_elements(By.CSS_SELECTOR, "div.movie-note div.note-text")
            qa_notes_list = []
            seen = set()

            for nd in note_divs:
                paragraphs = nd.find_elements(By.TAG_NAME, "p")
                for p in paragraphs:
                    # skip <p> that has <p> children (non-leaf)
                    if p.find_elements(By.TAG_NAME, "p"):
                        continue

                    txt = p.get_attribute("textContent").strip()
                    normalized = " ".join(txt.split())  # collapse whitespace
                    if normalized and normalized not in seen:
                        seen.add(normalized)
                        qa_notes_list.append(normalized)

            qa_notes = " ".join(qa_notes_list)
            logger.info(f"Found Q&A notes: {qa_notes}")

        except Exception as e:
            qa_notes = ""
            logger.warning(f"No Q&A notes found for {film.get('title', '')} ({e})")
     
        #  Movie date
        try:
            date_elem = driver.find_element(By.CSS_SELECTOR, "div#anytime span")
            raw_date = date_elem.get_attribute("textContent").strip()  # e.g., "Wednesday 9/17"
            logger.info(f"Raw showtime date: {raw_date}")

            # Extract the "9/17" part
            date_match = re.search(r"\d{1,2}/\d{1,2}", raw_date)
            if date_match:
                month_day = date_match.group(0)  # "9/17"
                # Add current year
                current_year = datetime.now().year
                dt = datetime.strptime(f"{month_day}/{current_year}", "%m/%d/%Y")
                date = dt.strftime("%Y-%m-%d")  
            else:
                date = ""

            logger.info(f"Extracted Q&A date: {date}")

        except Exception as e:
            date = ""
            logger.warning(f"No date found for {film.get('title', '')} ({e})")

        # Movie image
        try:
            img_elem = driver.find_element(By.CSS_SELECTOR, "section.movie-detail-banner-section img")
            img_url = img_elem.get_attribute("src")
            logger.info(f"Found image URL: {img_url}")
        except Exception as e:
            img_url = "No image"
            logger.warning(f"No image found for {film.get('title', '')} ({e})")

        # Update film data
        film_data = dict(film)  # copy into regular dict
        film_data.update({
            "rating": rating,
            "genre": genre,
            "runtime": runtime,
            "language": language,
            "description": description,
            "image_url": img_url,
            "date": date,
            "qa_notes": qa_notes
        })

        logger.info(f"Movie updated: {film_data.get('title', '')}")
        return film_data

    except Exception as e:
        logger.error(f"Error: couldn't find details about {film.get('title', '')}: {e}")
        return film
    

# if __name__ == "__main__": 
#     options = uc.ChromeOptions() 
# options.headless = False 
# driver = uc.Chrome(options=options) 
# # 🛠 Disable buggy destructor that causes ImportError on shutdown 
# uc.Chrome.__del__ = lambda self: None 
# film = { "title": "MEGADOC: EARLY ACCESS Q&A", "link": "https://angelikafilmcenter.com/nyc/movies/details/megadoc-early-access-qa" } 
# angelika_qna_movie_data(driver, film) 
# logger.info("Closing driver...") 
# try: 
#     driver.quit() 
# except Exception: 
#     pass