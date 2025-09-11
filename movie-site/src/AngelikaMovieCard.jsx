import { useRef, useState, useEffect } from "react";

function parseParagraphs(input) {
  if (!input) return [];
  try {
    return JSON.parse(input);
  } catch {
    return input
      .replace(/^\[|\]$/g, "")
      .replace(/^'|'$/g, "")
      .split(/',\s*'/)
      .map((s) => s.replace(/^'|'$/g, "").trim());
  }
}

export default function AngelikaMovieCard({ movie }) {
  const paragraphs_qna = parseParagraphs(movie.paragraphs_qna);
  const titleRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      const el = titleRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    }
  }, [movie.title]);

  return (
    <div
      id={`movie-${movie.title.replace(/\s+/g, "-")}`}
      className="keen-slider__slide flex justify-center min-w-[550px] max-w-[500px] rounded-2xl"
    >
      <div className="w-[800px] bg-white rounded-2xl shadow-lg relative group overflow-visible flex flex-col max-h-120">
        <img
          src={movie.image_url}
          alt={movie.title}
          className="h-50 w-full object-cover"
        />

        <div className="p-4 flex flex-col flex-grow justify-center text-center select-text">
          <div className="relative overflow-hidden">
            <h2
              ref={titleRef}
              className={`text-lg font-bold text-gray-900 line-clamp-2 transition-opacity duration-300 ${
                isOverflowing ? "group-hover:opacity-0" : ""
              }`}
              title={movie.title}
            >
              {movie.title}
            </h2>

            {isOverflowing && (
              <div
                className="absolute top-0 left-0 w-full bg-white p-2 
                            text-sm font-semibold text-gray-900 
                            max-h-[3.5rem] overflow-y-auto opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-md"
              >
                {movie.title}
              </div>
            )}
          </div>

          {/* Metadata */}
          <p className="text-sm text-gray-600 mt-1">
            {movie.rating && <span className="mr-2">Rated: {movie.rating}</span>}
            {movie.genre && <span className="mr-2">{movie.genre}</span>}
            {movie.duration && <span className="mr-2">{movie.duration}</span>}
            {movie.language && <span>{movie.language}</span>}
          </p>

          {/* Description */}
          {movie.description && (
            <div className="text-sm text-gray-800 overflow-auto max-h-25 px-2 text-left mt-2">
              <p>{movie.description}</p>
            </div>
          )}

          {/* Q&A paragraphs */}
          {paragraphs_qna.length > 0 && (
            <div className="text-sm text-gray-800 overflow-auto max-h-25 px-2 text-left mt-2">
              {paragraphs_qna.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <a
            href={movie.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition"
          >
            Get Tickets
          </a>
        </div>
      </div>
    </div>
  );
}
