import undetected_chromedriver as uc
import random
import time
import csv
import os
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from user_agents import USER_AGENTS
from angelika_qna_movie_data import angelika_qna_movie_data
from logger import get_logger

logger = get_logger()

def angelika_qna_scrape():
    options = uc.ChromeOptions()
    options.headless = True  # run in background
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument(f"user-agent={random.choice(USER_AGENTS)}")

    logger.info("Starting Chrome...")
    driver = uc.Chrome(options=options)

    try:
        logger.info("Opening Angelika search page...")
        driver.get("https://angelikafilmcenter.com/nyc/search")
        time.sleep(3)
        logger.info("Page loaded")

        # Click the search icon (img.pointer)
        try:
            logger.info("Looking for search icon...")
            search_icon = driver.find_element(By.CSS_SELECTOR, "img.pointer[role='button']")
            driver.execute_script("arguments[0].click();", search_icon)
            logger.info("Search icon clicked")
        except Exception as e:
            logger.error(f"Could not click search icon: {e}")
            return

        # Wait for input to appear
        try:
            logger.info("Waiting for input field...")
            search_box = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "search-input"))
            )
            logger.info("Input field found")
        except Exception as e:
            logger.error(f"Input field not found: {e}")
            return

        # Type Q&A and submit
        search_box.send_keys("Q&A")
        search_box.send_keys(Keys.RETURN)
        logger.info("Search submitted")
        time.sleep(5)

        logger.info("Looking for result cards...")
        cards = driver.find_elements(By.CSS_SELECTOR, "div.container-content div.card__wrap--outer")
        logger.info(f"Found {len(cards)} cards")

        shows = []
        for idx, card in enumerate(cards):
            try:
                link_el = card.find_element(By.CSS_SELECTOR, "a")
                title_el = card.find_element(By.CSS_SELECTOR, "h3")

                link = link_el.get_attribute("href")
                title = title_el.text.strip()

                logger.info(f"Movie {idx+1}: {title} ({link})")

                shows.append({
                    "theater": "Angelika NYC",
                    "title": title,
                    "link": link,
                    "rating": "No rating",
                    "genre": "No genre",
                    "runtime": "No runtime",
                    "language": "No language",
                    "description": "No description",
                    "image_url": "No image",
                    "date": "No date",
                    "qa_notes": "No notes"
                })
            except Exception as e:
                logger.error(f"Error parsing card {idx+1}: {e}")

        for i, film in enumerate(shows):
            shows[i] = angelika_qna_movie_data(driver, film)

        # Save to CSV
        outpath = "movie-site/public/angelika_qna_shows.csv"
        os.makedirs(os.path.dirname(outpath), exist_ok=True)

        logger.info(f"Saving {len(shows)} shows to CSV: {outpath}")
        with open(outpath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=[
                "theater", 
                "title", 
                "link", 
                "rating",
                "genre",
                "runtime",
                "language",
                "description",
                "image_url",
                "date",
                "qa_notes"])
            writer.writeheader()
            writer.writerows(shows)

        logger.info("CSV saved successfully")

    finally:
        logger.info("Quitting Chrome...")
        driver.quit()



if __name__ == "__main__":
    angelika_qna_scrape()
