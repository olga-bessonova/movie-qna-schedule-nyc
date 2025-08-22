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

  return (
    <div
      id={`movie-${movie.title.replace(/\s+/g, "-")}`}
      className="keen-slider__slide flex justify-center min-w-[550px] max-w-[500px]">
      <div className="w-[800px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-120">
        <img
          src={movie.image_url}
          alt={movie.title}
          className="h-50 w-full object-cover"
        />
        <div className="p-4 flex flex-col flex-grow justify-center text-center select-text">
          <h2 className="text-lg font-bold text-gray-900 line-clamp-1" title={movie.title}>{movie.title}</h2>
          {/* <h2 className="text-lg font-bold text-gray-900">{movie.title}</h2> */}
          <p className="text-sm text-gray-500 mt-1">
            {movie.runtime} 
          </p>

          {/* Multiple dates */}
          {Object.entries(grouped).map(([monthYear, days], i) => (
            <p key={i} className="text-sm text-gray-400 m-1">
              {`${monthYear.replace(/\d{4}$/, "").trim()} ${days.join(", ")}, ${monthYear.split(" ").pop()}`}
            </p>
          ))}

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