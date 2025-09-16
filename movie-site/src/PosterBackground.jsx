import React, { useMemo } from "react";

// Vite dynamic import for all poster images
const posters = import.meta.glob("./assets/posters/*.{png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});
const posterList = Object.values(posters);

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function PosterBackground() {
  const shuffled = useMemo(() => shuffleArray(posterList), []);

  // split into 3 rows instead of 4
  const rows = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) =>
      shuffled.slice(
        i * Math.ceil(shuffled.length / 3),
        (i + 1) * Math.ceil(shuffled.length / 3)
      )
    );
  }, [shuffled]);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {rows.map((rowPosters, rowIndex) => (
        <div
          key={rowIndex}
          className="flex whitespace-nowrap"
          style={{
            position: "absolute",
            top: `${(rowIndex / 3) * 100}%`,
            height: "33.33333%", // each row takes exactly 1/3 of viewport height
          }}
        >
          {rowPosters.map((poster, i) => (
            <img
              key={`${rowIndex}-${i}`}
              src={poster}
              alt="poster"
              className="w-auto h-full object-cover opacity-30"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
