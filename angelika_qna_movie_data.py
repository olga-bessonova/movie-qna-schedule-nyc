import time
import re
from datetime import datetime
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from logger import get_logger

logger = get_logger()

CSV_FIELDS = ["theater", "title", "link", "rating", "genre", "duration", "language", "description", "image_url", 
            #   "dates", 
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

        # Duration
        try:
            duration_div = driver.find_element(By.CSS_SELECTOR, "div.film-rating-wrapper img.duration").find_element(By.XPATH, "..")
            duration = duration_div.get_attribute("textContent").strip()
            logger.info(f"Found duration: {duration}")
        except Exception as e:
            duration = "No duration"
            logger.warning(f"No duration found for {film.get('title', '')} ({e})")

        # Language
        try:
            lang_div = driver.find_element(By.CSS_SELECTOR, "div.film-rating-wrapper img.language").find_element(By.XPATH, "..")
            language = lang_div.get_attribute("textContent").strip()
            logger.info(f"Found language: {language}")
        except Exception as e:
            language = "No language"
            logger.warning(f"No language found for {film.get('title', '')} ({e})")

        # Movie notes
        try:
            note_divs = driver.find_elements(By.CSS_SELECTOR, "div.movie-note div.note-text")
            qa_notes_list = []
            for nd in note_divs:
                paragraphs = nd.find_elements(By.TAG_NAME, "p")
                for p in paragraphs:
                    txt = p.get_attribute("textContent").strip()
                    if txt:
                        qa_notes_list.append(txt)

            qa_notes = " ".join(qa_notes_list)
            logger.info(f"Found Q&A notes: {qa_notes}")

        except Exception as e:
            qa_notes = ""
            logger.warning(f"No Q&A notes found for {film.get('title', '')} ({e})")

        
        # Movie dates
        # try:
        #     # Regex to capture dates like "Sept 17", "Sep 17", "September 17"
        #     date_pattern = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2}"
        #     matches = re.findall(date_pattern, qa_notes)

        #     extracted_dates = []
        #     for m in matches:
        #         m_norm = m.replace("Sept", "Sep")  # normalize to Python's %b
        #         try:
        #             dt = datetime.strptime(f"{m_norm} 2025", "%b %d %Y")  # short month
        #         except ValueError:
        #             dt = datetime.strptime(f"{m_norm} 2025", "%B %d %Y")  # long month
        #         extracted_dates.append(dt.strftime("%Y-%m-%d"))


        # except Exception as e:
        #     dates = ""
        #     logger.warning(f"No dates found for {film.get('title', '')} ({e})")

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
            "duration": duration,
            "language": language,
            "description": description,
            "image_url": img_url,
            # "dates": dates,
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