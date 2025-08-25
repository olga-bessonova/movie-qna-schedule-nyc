import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AMCMovieCard from "./AMCMovieCard"
import IFCMovieCard from "./IFCMovieCard"
import MovieCalendar from "./MovieCalendar";

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

  function makeEasternDate(year, month, day, hour = 18, minute = 0) {
    // Construct a date in UTC first
    // +4 because EDT (summer) is UTC-4 → 6pm ET = 22:00 UTC
    // +5 for winter time, however it's not being implemenetd to keep the code simple
    // because the time is not shown on the calendar
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour + 4, minute, 0));
  
    // Convert it to America/New_York time
    const eastern = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    return eastern;
  }
  

  // Expand movies with multiple dates into separate events
const calendarEvents = allMovies.flatMap((movie) => {
  if (!movie.date) return [];

  const dates = movie.date.split(",").map((d) => d.trim());

  return dates.map((d) => {
    const [year, month, day] = d.split("-").map(Number);

    // set to 7pm EST (UTC) instead of midnight, so that conversion from UTC to GMT would'nt mess movie dates
    const startDate = makeEasternDate(year, month, day, 18, 0); // 6pm ET
    const endDate   = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    return {
      title: movie.title,
      theater: movie.theater,
      start: startDate,
      end: endDate,
      allDay: true,
    };
  });
});

  

  return (
    <div>
      <MovieCalendar movies={calendarEvents} onEventSelect={handleEventSelect} />

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
          🎬 IFC
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
    </div>
  );
}
