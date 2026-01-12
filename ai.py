import csv
import time
import json
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found in .env file")
client = OpenAI(api_key=api_key)

INPUT_CSV = "movie-site/public/amc_qna_shows.csv"
OUTPUT_CSV = "movie-site/public/amc_qna_shows_ai.csv"

GENRES = [
    "Drama", "Documentary", "Comedy", "Thriller", "Horror",
    "Romance", "Action", "Animation", "Experimental", "Music / Concert"
]

THEMES = [
    "Immigration", "Identity", "Family", "Grief / Loss", "Politics",
    "Social Justice", "Mental Health", "Love / Relationships",
    "Art / Creativity", "History", "War / Conflict", "Music / Performance"
]

TONES = ["Melancholic", "Dark", "Warm", "Intense", "Playful", "Reflective"]


def analyze_movie(movie):
    # Combine description and paragraphs_qna into details
    description = movie.get("description", "")
    paragraphs_qna = movie.get("paragraphs_qna", "")
    
    # Handle paragraphs_qna if it's a list
    if isinstance(paragraphs_qna, list):
        paragraphs_qna = " ".join(paragraphs_qna)
    
    # Combine into details
    details_parts = []
    if description:
        details_parts.append(description)
    if paragraphs_qna:
        details_parts.append(paragraphs_qna)
    details = " ".join(details_parts)
    
    prompt = f"""
You are an AI assistant enriching movie screening data.

Choose ONLY from the allowed values below.

Genres (choose up to 3): {GENRES}
Themes (choose up to 3): {THEMES}
Tone (choose ONE): {TONES}
Recommendation: write a short recommendation for the movie.

Movie title:
{movie.get("title")}

Details:
{details}

Return STRICT JSON ONLY in this format:

{{
  "genres": [],
  "themes": [],
  "tone": "",
  "recommendation": ""
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You strictly follow tagging rules."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content


def main():
    with open(INPUT_CSV, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    output_rows = []

    for i, row in enumerate(rows, start=1):
        print(f"AI processing {i}/{len(rows)}: {row.get('title')}")

        try:
            ai_json = analyze_movie(row)
            print("AI RAW:", ai_json)
            row["ai_raw"] = ai_json
            output_rows.append(row)

            time.sleep(0.5)  # rate-limit safety

        except Exception as e:
            print("ERROR:", e)
            row["ai_raw"] = ""
            output_rows.append(row)

    fieldnames = list(output_rows[0].keys())

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"\nSaved AI-enriched CSV → {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
