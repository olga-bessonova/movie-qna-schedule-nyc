import { useRef, useState, useEffect } from "react";

// Note: Unlike AMC, IFC doesn't provide movie rating
function formatDate(dateSpring) {
  const date = new Date(dateSpring);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function groupDates(dates) {
  const groups = {};

  dates.forEach((d) => {
    const date = new Date(d);
    // skip invalid
    if (isNaN(date)) return; 
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const day = date.getDate();

    if (!groups[monthYear]) groups[monthYear] = [];
    groups[monthYear].push(day);
  });

  // Sort days inside each group
  Object.values(groups).forEach((days) => days.sort((a, b) => a - b));
  return groups;
}

function parseParagraphs(input) {
  if (!input) return [];
  // JSON.parse first (if it's valid JSON like '["...","..."]')
  try {
    return JSON.parse(input);
  } catch {
    // Fallback: strip brackets/quotes from Python-style list and split by "', '"
    return input
      .replace(/^\[|\]$/g, "") // remove outer [ ]
      .replace(/^'|'$/g, "")   // remove outer quotes if any
      .split(/',\s*'/)         // split between items
      .map((s) => s.replace(/^'|'$/g, "").trim()); // remove extra quotes
  }
}

export default function IFCMovieCard({ movie }) {
  const dates = movie.date ? movie.date.split(',').map((d) => d.trim()) : [];
  const grouped = groupDates(dates); 
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
      className="keen-slider__slide flex justify-center min-w-[550px] max-w-[500px]">
      <div className="w-[800px] bg-white rounded-2xl shadow-lg relative group overflow-visible flex flex-col max-h-120">
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
            {movie.runtime} 
          </p>
      

          {/* Multiple dates */}
          {Object.entries(grouped).map(([monthYear, days], i) => {
            console.log("debug:", monthYear, days); // side effect
            return (
              <p key={i}>
                {monthYear} {days.join(", ")}
              </p>
            );
          })}

          <div className="text-sm text-gray-800 overflow-auto max-h-25 px-2 text-left">
            {paragraphs_qna.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
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