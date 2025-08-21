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
    <div className="keen-slider__slide flex justify-center min-w-[250px] max-w-[500px] px-2">
      <div className="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] bg-white rounded-2xl shadow-lg flex flex-col max-h-[480px] relative group overflow-visible">
        <img
          src={movie.image_url}
          alt={movie.title}
          className="h-50 w-full object-cover"
        />

        <div className="p-4 flex flex-col flex-grow justify-center text-center select-text">
          {/* Clamped title */}
          <h2
            ref={titleRef}
            className="text-lg font-bold text-gray-900 line-clamp-2"
          >
            {movie.title}
          </h2>

          {/* Expanding overlay (can overflow card) */}
          {isOverflowing && (
            <div className="absolute bottom-[80px] left-0 w-full px-4 opacity-0 group-hover:opacity-100 z-50 bg-white shadow-xl py-2 transition duration-300 overflow-visible">
              <h2 className="text-lg font-bold text-gray-900 break-words whitespace-normal">
                {movie.title}
              </h2>
            </div>
          )}

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
