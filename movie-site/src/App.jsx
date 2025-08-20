import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AMCMovieCard from "./AMCMovieCard"
import IFCMovieCard from "./IFCMovieCard"

export default function App() {
  const [AMCmovies, setAMCmovies] = useState([]);
  const [IFCmovies, setIFCmovies] = useState([]);

  const [sliderRef, instanceRef] = useKeenSlider({
    // loop: true,
    mode: "free", // keeps slide centered
    slides: {
      perView: 3,   // exactly 2 full card
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
        setAMCmovies(results.data);
      },
    });

    Papa.parse("/ifc_qna_shows.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIFCmovies(results.data);
      },
    });
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [AMCmovies, IFCmovies, instanceRef]);

  return (
    <div>

      <div className="min-h-screen bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          🎬 AMC
        </h1>

        {/* Carousel AMC */}
        <div ref={sliderRef} className="keen-slider max-w-5xl mx-auto">
          {AMCmovies.map((movie, i) => (
            <AMCMovieCard key={i} movie={movie} />
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


  <div className="min-h-screen bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          🎬 IFC
        </h1>

        {/* Carousel IFC */}
        <div ref={sliderRef} className="keen-slider max-w-5xl mx-auto">
          {IFCmovies.map((movie, i) => (
            <IFCMovieCard key={i} movie={movie} />
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
    </div>
  );
}
