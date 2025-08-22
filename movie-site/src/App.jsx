import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AMCMovieCard from "./AMCMovieCard"
import IFCMovieCard from "./IFCMovieCard"
import MovieCalendar from "./MovieCalendar";

// Example movies array
const movies = [
  {
    title: "Relay Q&A with Director David Mackenzie",
    start: "2025-08-23",
    end: "2025-08-23",
    image_url: "https://example.com/image.jpg",
    runtime: "2 HR 22 MIN",
    rating: "R",
    link: "#",
  },
  {
    title: "Copy Relay Q&A with Director David Mackenzie",
    start: "2025-08-23",
    end: "2025-08-23",
    image_url: "https://example.com/image.jpg",
    runtime: "2 HR 22 MIN",
    rating: "R",
    link: "#",
  },
  {
    title: "Copy 2 Relay Q&A with Director David Mackenzie",
    start: "2025-08-23",
    end: "2025-08-23",
    image_url: "https://example.com/image.jpg",
    runtime: "2 HR 22 MIN",
    rating: "R",
    link: "#",
  },
  {
    title: "Almost Popular – Special Q&A",
    start: "2025-08-28",
    end: "2025-08-28",
    image_url: "https://example.com/image2.jpg",
    runtime: "2 HR 5 MIN",
    rating: "NR",
    link: "#",
  },
  {
    title: "No No NO",
    start: "2025-09-15",
    end: "2025-09-15",
    image_url: "https://example.com/image2.jpg",
    runtime: "2 HR 5 MIN",
    rating: "NR",
    link: "#",
  },
  {
    title: "Movie Movie Movie",
    date: "2025-09-21",
    image_url: "https://example.com/image2.jpg",
    runtime: "2 HR 5 MIN",
    rating: "NR",
    link: "#",
  },
];

export default function App() {
  const [AMCmovies, setAMCmovies] = useState([]);
  const [IFCmovies, setIFCmovies] = useState([]);

  const [amcSliderRef, amcInstanceRef] = useKeenSlider({
    mode: "free",
    slides: { perView: "auto", spacing: 20 },
    centered: true,
  });
  
  const [ifcSliderRef, ifcInstanceRef] = useKeenSlider({
    mode: "free",
    slides: { perView: "auto", spacing: 20 },
    centered: true,
  });

  useEffect(() => {
    if (amcInstanceRef.current) amcInstanceRef.current.update();
  }, [AMCmovies]);
  
  useEffect(() => {
    if (ifcInstanceRef.current) ifcInstanceRef.current.update();
  }, [IFCmovies]);

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


  return (
    <div>
      <MovieCalendar movies={movies} />

      <div className="bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          🎬 AMC
        </h1>

        // Carousel AMC 
        <div className="flex justify-center">
          <div ref={amcSliderRef} className="keen-slider justify-center mx-auto">
            {AMCmovies.map((movie, i) => (
              <AMCMovieCard key={i} movie={movie} />
            ))}
          </div>
        </div>

        // Arrows 
        <button
          onClick={() => amcInstanceRef.current?.prev()}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          ◀
        </button>
        <button
          onClick={() => amcInstanceRef.current?.next()}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          ▶
        </button>
      </div>


      <div className="bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          🎬 IFC
        </h1>

        // Carousel IFC
        <div className="flex justify-center"> 
          <div ref={ifcSliderRef} className="keen-slider justify-center mx-auto">
            {IFCmovies.map((movie, i) => (
              <IFCMovieCard key={i} movie={movie} />
            ))}
          </div>

        </div>

        // Arrows
        <button
          onClick={() => ifcInstanceRef.current?.prev()}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          ◀
        </button>
        <button
          onClick={() => ifcInstanceRef.current?.next()}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
