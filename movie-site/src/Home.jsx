import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import moment from "moment";
import { useSlideStore } from "./store";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AMCMovieCard from "./AMCMovieCard"
import IFCMovieCard from "./IFCMovieCard"
import AngelikaMovieCard from "./AngelikaMovieCard"

import MovieCalendar from "./Calendar";
import Carousel from "./Carousel";
import PosterBackground from "./PosterBackground";
import Footer from "./Footer";

export default function Home() {
  const [AMCmovies, setAMCmovies] = useState([]);
  const [IFCmovies, setIFCmovies] = useState([]);
  const [Angelikamovies, setAngelikamovies] = useState([]);

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
  
  const allMovies = [...AMCmovies, ...IFCmovies, ...Angelikamovies];

  const calendarEvents = allMovies.flatMap((movie) => {
    if (!movie.date) return [];
  
    const dates = typeof movie.date === "string"
      ? movie.date.split(",").map((d) => d.trim())
      : Array.isArray(movie.date) ? movie.date : [];
  
    return dates
      .map((d) => {
        if (!d) return null;
  
        // Accept ISO, slashes, two-digit years
        const parsed = moment(d, [
          "YYYY-MM-DD",
          "M/D/YYYY",
          "MM/DD/YYYY",
          "M/D/YY",
          "MM/DD/YY"
        ], true);
  
        if (!parsed.isValid()) {
          console.warn("Invalid date format:", d, "for movie", movie.title);
          return null;
        }
  
        const startDate = parsed.toDate();
        startDate.setUTCHours(22, 0, 0, 0); // normalize to 6pm ET
        const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
  
        return {
          title: movie.title,
          theater: movie.theater,
          start: startDate,
          end: endDate,
          allDay: true,
          movie_index: Number(movie.movie_index),
        };
      })
      .filter(Boolean);
  });
  
  
  return (
    <div className="bg-black">

      <div className="relative w-full  bg-black rounded-2xl shadow-lg p-4">
        {/* <div> */}
          <PosterBackground />
        <div className="relative">
            <MovieCalendar movies={calendarEvents}  />
        </div>
      </div>


      <div className="bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          AMC
        </h1>

        <div className="bg-black text-white p-8 relative" id="amc-section">
            <Carousel movies={AMCmovies} CardComponent={AMCMovieCard} theater="AMC" />
        </div>
      </div>


      <div className="bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          IFC Center
        </h1>

        <div className="bg-black text-white p-8 relative" id="ifc-section">
            <Carousel movies={IFCmovies} CardComponent={IFCMovieCard} theater="IFC Center" />
        </div>
      </div>

      <div className="bg-black text-white p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          Angelika NYC
        </h1>

        <div className="bg-black text-white p-8 relative" id="angelika-section">
            <Carousel movies={Angelikamovies} CardComponent={AngelikaMovieCard} theater="Angelika NYC" />
        </div>
      </div>

      <Footer />

    </div>
  );
}
