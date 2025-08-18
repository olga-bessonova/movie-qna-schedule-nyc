import time
from selenium.webdriver.common.by import By
from logger import get_logger

logger = get_logger()

def amc_qna_movie_data(driver, film):
    
    try:
        driver.get(film["link"])
        time.sleep(3)

        # Movie duration
        runtime = ""
        for rt in driver.find_elements(By.CSS_SELECTOR, "span.uppercase"):
            if "HR" in rt.text or "MIN" in rt.text:
                runtime = rt.text
                break

        # Movie ranking
        try:
            rating_elem = driver.find_element(By.CSS_SELECTOR, "span[aria-label^='MPAA Rating:']")
            rating = rating_elem.get_attribute("aria-label").replace("MPAA Rating:", "").strip()
        except:
            rating = "No ranking"

        # Screening date
        try:
            date = driver.find_element(By.CSS_SELECTOR, "p.mb-2.uppercase.text-sm.font-semibold.leading-tight.tracking-normal").text
        except:
            date = "No date"

        # Movie image
        try:
            img_elem = driver.find_element(By.CSS_SELECTOR, "img[alt*='" + film['title'].split(':')[0] + "']")
            img_url = img_elem.get_attribute("src")
        except:
            img_url = "No image"

        film.update({
            "runtime": runtime,
            "rating": rating,
            "date": date,
            "image_url": img_url
        })

        logger.info(f"Movie added: {film['title']}")
        return film

    except Exception as e:
        logger.error(f"Error: couldn't find details about {film['title']}: {e}")
        return film