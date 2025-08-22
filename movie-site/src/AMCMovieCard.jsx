import { useRef, useState, useEffect } from "react";

function formatDate(dateSpring) {
  const date = new Date(dateSpring);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AMCMovieCard({ movie }) {
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
      className="keen-slider__slide flex justify-center min-w-[250px] max-w-[500px] px-2">
      <div className="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] bg-white rounded-2xl shadow-lg flex flex-col max-h-[480px] relative group overflow-visible">
        <img
          src={movie.image_url}
          alt={movie.title}
          className="h-50 w-full object-cover"
        />

        <div className="p-4 flex flex-col flex-grow justify-center text-center select-text">
          <div className="relative overflow-hidden">
            {/* Clamped Title */}
            <h2
              ref={titleRef}
              className={`text-lg font-bold text-gray-900 line-clamp-2 transition-opacity duration-300 ${
                isOverflowing ? "group-hover:opacity-0" : ""
              }`}
              title={movie.title}
            >
              {movie.title}
            </h2>

            {/* Hover Overlay (only if overflowing) */}
            {isOverflowing && (
              <div className="absolute top-0 left-0 w-full bg-white p-2 
                              text-sm font-semibold text-gray-900 
                              max-h-[3.5rem] overflow-y-auto opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-md">
                {movie.title}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {movie.runtime} | {movie.rating}
          </p>
          <p className="text-sm text-gray-400 m-1">{formatDate(movie.date)}</p>
          <a
            href={movie.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-900 transition"
          >
            Get Tickets
          </a>
        </div>
      </div>
    </div>
  );
}
