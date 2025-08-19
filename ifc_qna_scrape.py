import requests
import random
import csv
from bs4 import BeautifulSoup
from logger import get_logger 
from user_agents import USER_AGENTS

logger = get_logger()

def ifc_qna_scrape():
    url = "https://www.ifccenter.com/?s=q%26a"
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        logger.info(f"Successfully fetched {url} status {response.status_code}")
        soup = BeautifulSoup(response.text, "html.parser")
        posts = soup.select("div.post")

        movies = []
        for post in posts:
            a_tag = post.find("a")
            title = a_tag.get_text(strip = True) if a_tag else "NOT FOUND"
            link = a_tag["href"] if a_tag else "NOT FOUND"
            description = post.find("p").get_text(strip=True) if post.find("p") else "NOT FOUND"

            movies.append({
                "theater": "IFC Center",
                "title": title,
                "link": link,
                "date": "",
                "description": description,
                "runtime": "",
                "rating": "",
                "ticket_link": "",
                "image_url": ""
            })

        with open("ifc_qna_shows.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=movies[0].keys())
            writer.writeheader()
            writer.writerows(movies)
        
        logger.info(f"Saved {len(movies)} IFC Q&A movies to ifc_qna_shows.csv")

    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error {e.response.status_code} for {url}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for {url}: {e}")

if __name__ == "__main__":
    ifc_qna_scrape()

