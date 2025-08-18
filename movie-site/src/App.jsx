import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function formatDate(dateSpring) {
  const date = new Date(dateSpring);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function MovieCard({ movie }) {
  return (
    <div className="keen-slider__slide !w-[800px] flex justify-center">
      <div className="w-[800px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <img
          src={movie.image_url}
          alt={movie.title}
          className="h-50 w-full object-cover"
        />
        <div className="p-4 flex flex-col flex-grow justify-center text-center">
          <h2 className="text-lg font-bold text-gray-900">{movie.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {movie.runtime} | {movie.rating}
          </p>
          <p className="text-sm text-gray-400 m-1">{formatDate(movie.date)}</p>
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
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);

  const [sliderRef, instanceRef] = useKeenSlider({
    // loop: true,
    mode: "free", // keeps slide centered
    slides: {
      // origin: "begin",
      // perView: "auto",   
      perView: 2,   // exactly 2 full card
      spacing: 20,  // spacing so next card peeks
    },
    centered: true, // force center mode
  });

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
    <div className="min-h-screen bg-black text-white p-8 relative">
      <h1 className="text-3xl font-bold text-center mb-10">
        🎬 Movie Q&A Schedule
      </h1>

      {/* Carousel */}
      <div ref={sliderRef} className="keen-slider max-w-5xl mx-auto">
        {movies.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
      >
        ◀
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
      >
        ▶
      </button>
    </div>
  );
}
