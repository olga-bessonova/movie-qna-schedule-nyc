import React from "react";

// Vite dynamic import for all poster images
const posters = import.meta.glob("./assets/posters/*.{png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});
const posterList = Object.values(posters);

// Shuffle once
function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function PosterBackground() {
  const shuffled = shuffleArray(posterList);

  // split into 4 rows
  const rows = Array.from({ length: 4 }, (_, i) =>
    shuffled.slice(i * Math.ceil(shuffled.length / 4), (i + 1) * Math.ceil(shuffled.length / 4))
  );

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {rows.map((rowPosters, rowIndex) => (
        <div
          key={rowIndex}
          className="flex whitespace-nowrap"
          style={{
            position: "absolute",
            top: `${rowIndex * 25}%`,
          }}
        >
          {rowPosters.map((poster, i) => (
            <img
              key={`${rowIndex}-${i}`}
              src={poster}
              alt="poster"
              className="h-40 w-auto object-cover mx-1 opacity-60 rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
