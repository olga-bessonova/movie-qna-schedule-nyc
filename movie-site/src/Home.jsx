import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AMCMovieCard from "./AMCMovieCard"
import IFCMovieCard from "./IFCMovieCard"
import AngelikaMovieCard from "./AngelikaMovieCard"
import MovieCalendar from "./Calendar";
import PosterBackground from "./PosterBackground";
import Footer from "./Footer";


export default function Home() {
  const [AMCmovies, setAMCmovies] = useState([]);
  const [IFCmovies, setIFCmovies] = useState([]);
  const [Angelikamovies, setAngelikamovies] = useState([]);

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

  const [angelikaSliderRef, angelikaInstanceRef] = useKeenSlider({
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
    if (angelikaInstanceRef.current) angelikaInstanceRef.current.update();
  }, [Angelikamovies]);

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

    Papa.parse("/angelika_qna_shows.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setAngelikamovies(results.data);
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

    if (event.theater === "Angelika NYC") {
      const index = Angelikamoviesmovies.findIndex((m) => m.title === event.title);
      if (index !== -1 && angelikaInstanceRef.current) {
        angelikaInstanceRef.current.moveToIdx(index, true, { align: "center" });
        document.getElementById("angelika-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };
  
  const allMovies = [...AMCmovies, ...IFCmovies, ...Angelikamovies];

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

      <div className="relative w-full  bg-black rounded-2xl shadow-lg p-4">
        {/* <div> */}
          <PosterBackground />
        <div className="relative">
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

      <div className="bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          🎬 Angelika
        </h1>

        {/* Carousel Angelika */}
        <div className="flex justify-center"> 
          <div ref={angelikaSliderRef} className="keen-slider justify-center mx-auto">
            {Angelikamovies.map((movie, i) => (
              <AngelikaMovieCard key={i} movie={movie} />
            ))}
          </div>

        </div>

        {/* Arrows */}
        <button
          onClick={() => angelikaInstanceRef.current?.prev()}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          ◀
        </button>
        <button
          onClick={() => angelikaInstanceRef.current?.next()}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          ▶
        </button>
      </div>

      <Footer />

    </div>
  );
}
