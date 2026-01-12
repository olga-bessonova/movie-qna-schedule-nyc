import undetected_chromedriver as uc
import random
import json
import time
import os
import csv
from datetime import datetime
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from amc_qna_movie_list import amc_qna_movie_list
from amc_qna_movie_data import amc_qna_movie_data
from user_agents import USER_AGENTS
from logger import get_logger

logger = get_logger()

def normalize_date(date_str):
    formats = [
        "%d-%b-%y",     # 10-Sep-25
        "%B %d, %Y",    # September 10, 2025
        "%b %d, %Y",    # Sep 10, 2025
        "%Y-%m-%d"      # already normalized
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            return dt.strftime("%Y-%m-%d")  # normalize
        except ValueError:
            continue
    logger.warning(f"Date {date_str} is not matching known formats")
    return date_str


def amc_qna_scrape():
    options = uc.ChromeOptions()
    options.headless = False
    options.add_argument(f'user-agent={random.choice(USER_AGENTS)}')

    driver = uc.Chrome(options=options)

    try:
        # Load cookies if they exist
        if os.path.exists('cookies.json'):
            logger.info("Loading cookies...")
            driver.get("https://www.amctheatres.com")
            time.sleep(3)
            with open('cookies.json', 'r') as f:
                cookies = json.load(f)
            logger.info(f"Loading {len(cookies)} cookies...")
            for cookie in cookies:
                cookie.pop('sameSite', None)
                cookie.pop('expiry', None)
                try:
                    driver.add_cookie(cookie)
                except Exception as e:
                    logger.error(f"Error in cookie {cookie.get('name')}: {e}")
            logger.info("Cookies loaded. Refreshing page...")
            driver.refresh()
            time.sleep(2)

        logger.info("Navigating to AMC search page...")
        driver.get("https://www.amctheatres.com/search?filter=all&q=q%26a")
        
        # Wait for page to load and verify we're on the right page
        try:
            WebDriverWait(driver, 15).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            logger.info(f"Page loaded. Current URL: {driver.current_url}")
            logger.info(f"Page title: {driver.title}")
            
            # Wait a bit more for dynamic content
            time.sleep(3)
            
            # Check if page has loaded content
            sections = driver.find_elements(By.TAG_NAME, "section")
            logger.info(f"Found {len(sections)} sections on page")
            
        except Exception as e:
            logger.error(f"Page load error: {e}")
            logger.error(f"Current URL: {driver.current_url}")
            raise

        film_links = amc_qna_movie_list(driver)
        
        if not film_links:
            logger.warning("No film links found! Check if page loaded correctly.")
            logger.info(f"Page source length: {len(driver.page_source)}")
            # Take a screenshot for debugging
            try:
                driver.save_screenshot("amc_debug_screenshot.png")
                logger.info("Saved debug screenshot: amc_debug_screenshot.png")
            except:
                pass
            logger.error("Stopping: No movies found to scrape")
            return

        logger.info(f"Found {len(film_links)} movies to process")

        shows = []
        for i, film in enumerate(film_links):
            show = amc_qna_movie_data(driver, film)
            show["movie_index"] = i
            if "date" in show and show["date"]:
                show["date"] = normalize_date(show["date"])  # normalize date here
            shows.append(show)
        
        # Sort movies by normalized date
        shows.sort(key=lambda x: x.get("date", "9999-12-31")) # "9999-12-31" ensures movies with missing/invalid dates go to the end


        # Save to CSV
        with open("movie-site/public/amc_qna_shows.csv", "w", newline="", encoding="utf-8") as f:
            fieldnames = [
                "theater", "title", "link", "date", "description", 
                "runtime", "rating", "ticket_link", "image_url", "movie_index"
            ]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(shows)

        logger.info(f"Saved {len(shows)} movies with Q&A to amc_qna_shows.csv")

        # Save cookies
        with open('cookies.json', 'w') as f:
            json.dump(driver.get_cookies(), f, indent=2)

    finally:
        driver.quit()


if __name__ == "__main__":
    amc_qna_scrape()
