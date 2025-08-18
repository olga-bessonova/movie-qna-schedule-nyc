from selenium.webdriver.common.by import By
from logger import get_logger


logger = get_logger()

def amc_qna_movie_list(driver):
    film_links = []
    theater = 'AMC'
    try:
        sections = driver.find_elements(By.TAG_NAME, "section")
        for section in sections:
            try:
                h2_elem = section.find_element(By.TAG_NAME, "h2")
                if "movies found" in h2_elem.text.lower():
                    logger.info("AMC: Q&A movies are found")
                    uls = section.find_elements(By.CSS_SELECTOR, "ul.mt-8.flex.flex-wrap.gap-5")
                    for ul in uls:
                        films = ul.find_elements(By.TAG_NAME, "li")
                        for film in films:
                            try:
                                title_elem = film.find_element(By.TAG_NAME, "h3")
                                title = title_elem.text.strip()
                                if "Q&A" in title:
                                    link_elem = film.find_element(By.TAG_NAME, "a")
                                    link = link_elem.get_attribute("href")

                                    try:
                                        desc_elem = film.find_element(By.TAG_NAME, "p")
                                        desc = desc_elem.text.strip()
                                    except:
                                        desc = "No description"
                                    
                                    try:
                                        footer = film.find_element(By.TAG_NAME, "footer")
                                        try:
                                            ticket_a = footer.find_element(By.XPATH, ".//a[contains(text(), 'Advance Tickets')]")
                                            ticket_link = ticket_a.get_attribute("href")
                                        except:
                                            try:
                                                # If there is no link, check if there is a span "Remind Me"
                                                remind_span = footer.find_element(By.XPATH, ".//span[contains(text(), 'Remind Me')]")
                                                ticket_link = "The link is not available yet. Stand By."
                                            except:
                                                ticket_link = "No ticket info found"
                                    except Exception as e:
                                        logger.error("Error: couldn't find ticket link:", e)
                                        ticket_link = "No ticket link"        

                                        


                                    film_links.append({
                                        "theater": theater,
                                        "title": title,
                                        "link": link,
                                        "description": desc,
                                        "ticket_link": ticket_link
                                    })
                            except Exception as e:
                                logger.error("Error:", e)
            except:
                continue

    except Exception as e:
        logger.error("Error: can't find element 'section':", e)

    logger.info(f"Found {len(film_links)} movies with Q&A")
    return film_links