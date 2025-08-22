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
    theater: "IFC"
  },
  {
    title: "Copy Relay Q&A with Director David Mackenzie",
    start: "2025-08-23",
    end: "2025-08-23",
    image_url: "https://example.com/image.jpg",
    runtime: "2 HR 22 MIN",
    rating: "R",
    link: "#",
    theater: "IFC"
  },
  {
    title: "Copy 2 Relay Q&A with Director David Mackenzie",
    start: "2025-08-23",
    end: "2025-08-23",
    image_url: "https://example.com/image.jpg",
    runtime: "2 HR 22 MIN",
    rating: "R",
    link: "#",
    theater: "AMC"

  },
  {
    title: "Almost Popular – Special Q&A",
    start: "2025-08-28",
    end: "2025-08-28",
    image_url: "https://example.com/image2.jpg",
    runtime: "2 HR 5 MIN",
    rating: "NR",
    link: "#",
    theater: "AMC"
  },
  {
    title: "No No NO",
    start: "2025-09-15",
    end: "2025-09-15",
    image_url: "https://example.com/image2.jpg",
    runtime: "2 HR 5 MIN",
    rating: "NR",
    link: "#",
    theater: "IFC"
  },
  {
    title: "Movie Movie Movie",
    date: "2025-09-21",
    image_url: "https://example.com/image2.jpg",
    runtime: "2 HR 5 MIN",
    rating: "NR",
    link: "#",
    theater: "AMC"
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

  const allMovies = [...AMCmovies, ...IFCmovies];

  const centerSlide = (slider, index) => {
    const track = slider.track.details;
    if (!track) return;
  
    // Slide details
    const slide = track.slides[index];
    const viewportWidth = track.width;
  
    // Slide center position relative to track
    const slideCenter = slide.left + slide.size / 2;
  
    // Target scroll so that this center is in middle of viewport
    const target = slideCenter - viewportWidth / 2;
  
    slider.moveToIdx(index, true, { align: "center"
      // absolute: true,
    });
  
    // force scroll alignment
    slider.container.scrollTo({
      left: target,
      behavior: "smooth",
    });
  };
  
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
  
  

  return (
    <div>
      <MovieCalendar movies={allMovies} onEventSelect={handleEventSelect} />

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
