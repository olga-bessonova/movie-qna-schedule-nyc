import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useSlideStore } from "./store";
import IFCMovieCard from "./IFCMovieCard";

export default function Carousel({ 
    movies,
    CardComponent,
    theater,
 }) {
  const [emblaRef, embla] = useEmblaCarousel({ 
    loop: false, 
    align: "center" 
  });
  const {
    currentAMCSlide,
    currentIFCSlide,
    currentAngelikaSlide,
    setCurrentAMCSlide,
    setCurrentIFCSlide,
    setCurrentAngelikaSlide,
  } = useSlideStore();

  const slideValue =
    theater === "AMC"
      ? currentAMCSlide
      : theater === "IFC Center"
      ? currentIFCSlide
      : currentAngelikaSlide;

  const setSlideValue =
    theater === "AMC"
      ? setCurrentAMCSlide
      : theater === "IFC Center"
      ? setCurrentIFCSlide
      : setCurrentAngelikaSlide;

      useEffect(() => {
        if (!embla) return;
        const onSelect = () => setSlideValue(embla.selectedScrollSnap());
        embla.on("select", onSelect);
        return () => embla.off("select", onSelect);
      }, [embla, theater, setSlideValue]);
    
      // Sync store → carousel
      useEffect(() => {
        if (embla && typeof slideValue === "number") {
          embla.scrollTo(slideValue);
        }
      }, [slideValue, embla]);
    
      return (
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex items-stretch">
              {movies.map((movie, i) => (
                <div
                  key={i}
                  className="flex-[0_0_90%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] px-2 flex"
                >
                  <CardComponent movie={movie} />
                </div>
              ))}
            </div>
          </div>
    
          {/* Arrows */}
          <button
            onClick={() => embla?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition z-10"
          >
            ◀
          </button>
    
          <button
            onClick={() => embla?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full hover:bg-gray-900 transition z-10"
          >
            ▶
          </button>
        </div>
      );
    }