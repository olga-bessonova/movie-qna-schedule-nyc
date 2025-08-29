import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AMCMovieCard from "./AMCMovieCard"
import IFCMovieCard from "./IFCMovieCard"
import MovieCalendar from "./Calendar";
import PosterBackground from "./PosterBackground";


export default function Home() {
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
  
  const handleEventSelect = (event) => {
    if (event.theater === "AMC") {
      const index = AMCmovies.findIndex((m) => m.title === event.title);
      if (index !== -1 && amcInstanceRef.current) {
        amcInstanceRef.current.moveToIdx(index, true, { align: "center" });
        document.getElementById("amc-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  
    if (event.theater === "IFC") {
      const index = IFCmovies.findIndex((m) => m.title === event.title);
      if (index !== -1 && ifcInstanceRef.current) {
        ifcInstanceRef.current.moveToIdx(index, true, { align: "center" });
        document.getElementById("ifc-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };
  
  const allMovies = [...AMCmovies, ...IFCmovies];

  // Expand movies with multiple dates into separate events
  const calendarEvents = allMovies.flatMap((movie) => {
    if (!movie.date) return [];
  
    // Ensure we always have a string
    const dates = typeof movie.date === "string"
      ? movie.date.split(",").map((d) => d.trim())
      : Array.isArray(movie.date) ? movie.date : [];
  
    return dates
      .filter((d) => d && d.includes("-")) // skip empty or invalid
      .map((d) => {
        const [year, month, day] = d.split("-").map(Number);
  
        if (!year || !month || !day) return null; // safeguard
  
        // 6pm Eastern → store directly as UTC
        const startDate = new Date(Date.UTC(year, month - 1, day, 22, 0, 0)); // 22:00 UTC = 6pm ET
        const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
  
        return {
          title: movie.title,
          theater: movie.theater,
          start: startDate,
          end: endDate,
          allDay: true,
        };
      })
      .filter(Boolean); // remove nulls
  });
  
  return (
    <div className="bg-black">
      <div className="relative w-full h-full">
        <PosterBackground />

        <div className="relative z-10">
            <MovieCalendar movies={calendarEvents} onEventSelect={handleEventSelect} />
        </div>
      </div>


      <div className="bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          🎬 AMC
        </h1>

        {/* Carousel AMC  */}
        <div className="flex justify-center">
          <div ref={amcSliderRef} className="keen-slider justify-center mx-auto">
            {AMCmovies.map((movie, i) => (
              <AMCMovieCard key={i} movie={movie} />
            ))}
          </div>
        </div>

        {/* Arrows  */}
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
          🎬 IFC Center
        </h1>

        {/* Carousel IFC */}
        <div className="flex justify-center"> 
          <div ref={ifcSliderRef} className="keen-slider justify-center mx-auto">
            {IFCmovies.map((movie, i) => (
              <IFCMovieCard key={i} movie={movie} />
            ))}
          </div>

        </div>

        {/* Arrows */}
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

      <footer className="text-center text-white text-sm py-4 flex flex-col items-center space-y-2">
        <p>
          © 2025 Q&A Movies Calendar in New York City — Developed by <span className="font-bold">Olga Bessonova</span>
        </p>
        <div className="flex space-x-4">
          {/* GitHub */}
          <a
            href="https://github.com/olga-bessonova"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.5-3.9-1.5-.6-1.6-1.5-2-1.5-2-1.2-.9.1-.9.1-.9 1.3.1 2 .9 2 .9 1.1 2 2.9 1.4 3.6 1.1.1-.8.4-1.4.7-1.7-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.2 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A10.9 10.9 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
            </svg>
          </a>

          {/* Website */}
          <a
            href="https://olgabessonova.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm6.9 6h-2.5c-.3-1.5-.8-2.9-1.5-4.2 1.9.6 3.4 2.2 4 4.2zM12 4.1c.8 1.3 1.4 2.8 1.7 4.4H10.3c.3-1.6.9-3.1 1.7-4.4zM4.6 14c-.4-.6-.6-1.9-.6-2s.2-1.4.6-2h2.7c-.1.7-.2 1.3-.2 2s.1 1.3.2 2H4.6zm.5 2h2.5c.3 1.5.8 2.9 1.5 4.2-1.9-.6-3.4-2.2-4-4.2zM8.4 8.5c.3-1.6.9-3.1 1.7-4.4-1.9.6-3.4 2.2-4 4.2h2.3zm0 7c-.3-1.6-.5-2.2-.5-3.5s.2-1.9.5-3.5H15.6c.3 1.6.5 2.2.5 3.5s-.2 1.9-.5 3.5H8.4zm1.9 2.9c-.8-1.3-1.4-2.8-1.7-4.4h3.4c-.3 1.6-.9 3.1-1.7 4.4zm5.3-4.4h2.7c.4.6.6 1.9.6 2s-.2 1.4-.6 2h-2.7c.1-.7.2-1.3.2-2s-.1-1.3-.2-2z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/olgabessonova-/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM8.3 19.2H5.1V9.1h3.2v10.1zM6.7 7.8c-1 0-1.9-.9-1.9-1.9s.9-1.9 1.9-1.9 1.9.9 1.9 1.9-.9 1.9-1.9 1.9zM20 19.2h-3.2v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7h-3.2V9.1h3.1v1.4h.1c.5-.9 1.8-1.8 3.7-1.8 3.9 0 4.6 2.5 4.6 5.7v5.8z"/>
            </svg>
          </a>
        </div>
      </footer>

    </div>
  );
}
