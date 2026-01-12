from ai import analyze_movie

test_movie = {
    "title": "Past Lives",
    "description": "A tender drama about immigration, memory, and relationships.",
    "paragraphs_qna": "The director discusses autobiographical elements of the film."
}

result = analyze_movie(test_movie)

print("RAW AI OUTPUT:")
print(result)
