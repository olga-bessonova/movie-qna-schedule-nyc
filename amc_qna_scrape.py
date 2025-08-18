import undetected_chromedriver as uc
import random
import json
import time
import os
import csv
from selenium.webdriver.common.by import By
from amc_qna_movie_list import amc_qna_movie_list
from amc_qna_movie_data import amc_qna_movie_data
from logger import get_logger

logger = get_logger()

def amc_qna_scrape():
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    ]

    options = uc.ChromeOptions()
    options.headless = False
    options.add_argument(f'user-agent={random.choice(user_agents)}')

    driver = uc.Chrome(options=options)

    try:
        # Load cookies if they exist
        if os.path.exists('cookies.json'):
            driver.get("https://www.amctheatres.com")
            time.sleep(3)
            with open('cookies.json', 'r') as f:
                cookies = json.load(f)
            for cookie in cookies:
                cookie.pop('sameSite', None)
                cookie.pop('expiry', None)
                try:
                    driver.add_cookie(cookie)
                except Exception as e:
                    logger.error(f"Error in cookie {cookie.get('name')}: {e}")

        driver.get("https://www.amctheatres.com/search?filter=all&q=q%26a")
        time.sleep(5)

        film_links = amc_qna_movie_list(driver)

        shows = []
        for film in film_links:
            shows.append(amc_qna_movie_data(driver, film))

        # Save to CSV
        with open("amc_qna_shows.csv", "w", newline="", encoding="utf-8") as f:
            fieldnames = [
                "theater", "title", "link", "date", "description", 
                "runtime", "rating", "ticket_link", "image_url"
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
