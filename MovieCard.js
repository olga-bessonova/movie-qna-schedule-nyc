import React, { useEffect, useState } from "react";
import Papa from "papaparse";

function MovieCard({ movie }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-64 flex flex-col">
      <img
        src={movie.image_url}
        alt={movie.title}
        className="h-96 object-cover w-full"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-bold">{movie.title}</h2>
        <p className="text-sm text-gray-500">{movie.runtime} | {movie.rating}</p>
        <p className="text-sm text-gray-400 mt-1">
          Released {movie.date}
        </p>
        <a
          href={movie.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition"
        >
          Get Tickets
        </a>
      </div>
    </div>
  );
}

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    Papa.parse("/amc_qna_shows.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setMovies(results.data);
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🎬 Movie Q&A Schedule
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {movies.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>
    </div>
  );
}
