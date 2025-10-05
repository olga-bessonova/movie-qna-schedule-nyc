import requests
import random
import csv
from datetime import datetime
from bs4 import BeautifulSoup
from logger import get_logger 
from user_agents import USER_AGENTS
from ifc_qna_movie_data import ifc_qna_movie_data

logger = get_logger()

def get_earliest_date(date_str):
    if not date_str:
        return "9999-12-31"  

    parts = [d.strip() for d in date_str.split(",") if d.strip()]
    parsed = []
    for p in parts:
        try:
            parsed.append(datetime.strptime(p, "%Y-%m-%d"))
        except ValueError:
            continue
    if not parsed:
        return "9999-12-31"
    return min(parsed).strftime("%Y-%m-%d")


def scrape_page(page_num):
    url = f"https://www.ifccenter.com/page/{page_num}/?s=q%26a"
    headers = {"User-Agent": random.choice(USER_AGENTS)}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    logger.info(f"Successfully fetched {url} status {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")
    posts = soup.select("div.post")
    if not posts:
        logger.info(f"No posts found on {url}, stopping.")
        return []

    movies = []
    movie_index = 0
    for post in posts:
        a_tag = post.find("a")
        title = a_tag.get_text(strip=True) if a_tag else "NOT FOUND"
        link = a_tag["href"] if a_tag else "NOT FOUND"
        description = post.find("p").get_text(strip=True) if post.find("p") else "NOT FOUND"

        movie_data = ifc_qna_movie_data(link)
        if movie_data:
            movies.append({
                "theater": "IFC Center",
                "title": title,
                "link": link,
                "date": movie_data.get("dates", ""),
                "description": description,
                "runtime": movie_data.get("runtime", ""),
                "rating": "",
                "ticket_link": "",
                "image_url": movie_data.get("image_url", ""),
                "paragraphs_qna": movie_data.get("paragraphs_qna", []),
                "movie_index": movie_index,
            }
            movie_index =+
            )
        else:
            logger.info(f"Skipping movie because it has no upcoming Q&A {link}")

    return movies


def ifc_qna_scrape():
    all_movies = []
    for page in range(1, 11):  # go through pages 1–10
        try:
            page_movies = scrape_page(page)
            if not page_movies:
                break  # stop if no more results
            all_movies.extend(page_movies)
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error {e.response.status_code} on page {page}")
            break
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed on page {page}: {e}")
            break

    if all_movies:
        # sort by earliest date
        all_movies.sort(key=lambda m: get_earliest_date(m["date"]))

        with open("movie-site/public/ifc_qna_shows.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=all_movies[0].keys())
            writer.writeheader()
            writer.writerows(all_movies)
        
        logger.info(f"Saved {len(all_movies)} IFC Q&A movies to ifc_qna_shows.csv")
    else:
        logger.info("No upcoming Q&A movies found, skipping CSV write")


if __name__ == "__main__":
    ifc_qna_scrape()
