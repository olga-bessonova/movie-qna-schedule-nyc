import Footer from './Footer.jsx'
import olgaInfo2 from "./assets/developer/olga4.png";
import Feedback from './Feedback.jsx'

export default function About() {
  return (
    // <div className='bg-black flex flex-col'>
    
    <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28 py-12 
                flex flex-col lg:flex-row flex-wrap items-center justify-between gap-12">

      <div className="flex-1">
        <div style={{ maxWidth: "1800px"}} className="mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-12 flex flex-col lg:flex-row justify-center items-center gap-10 px-5 py-4 flex justify-center items-center">
          
          {/* Left: Text */}
          <div className="text-white space-y-6 flex-1 min-w-[300px] max-w-[700px]">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              About <span className="text-[#ffc211]">Q&A Movies</span>
            </h1>
            <p className="text-lg text-gray-300">
              In the amazing city of New York, countless film screenings feature special 
              <span className="text-[#e3a4d3] font-semibold"> Q&A sessions </span>
            
              with directors, actors, screenwriters, producers, and more.
              <br /><br />

              It’s a unique chance to meet creators in person, ask questions, and experience cinema in a whole new way.
              <br /><br />

              This site is a centralized calendar that gathers upcoming 
              <span className="text-[#e3a4d3] font-semibold"> Q&A sessions </span>            
              in one place, so you don’t have to search theater by theater.

              As a film lover and software developer, I built this project as a hobby and I hope it will be useful to many others who share the same passion. Your feedback and support mean a lot!
            </p>
              
            <p className="text-xs">

              Found a bug? 
              <a
                href="https://github.com/olga-bessonova/movie-qna-schedule-nyc/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="m-1 text-blue-400 font-semibold hover:bg-pink-300 hover:text-white 
                          transition-colors shadow-lg p-2 rounded-xl"
              >
                 Open an Issue
              </a>
            </p>

            
    
            

            {/* CTA → Buy Me a Coffee */}
            <div className="flex gap-4">
              <a
                href="https://buymeacoffee.com/olgabessonova"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-8 py-3 rounded-xl font-semibold 
                          text-black bg-[#ffc211] hover:bg-[#e3a4d3] hover:text-white 
                          transition-colors shadow-lg"
              >
                Buy Me a Coffee
              </a>

              <a
                href="https://account.venmo.com/u/olga_bb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-8 py-3 rounded-xl font-semibold 
                          text-black bg-[#ffc211] hover:bg-[#e3a4d3] hover:text-white 
                          transition-colors shadow-lg"
              >
                Venmo
              </a>
            </div>

          
          </div>

          {/* Right: Image + graphics */}
          <div className="relative flex-1 min-w-[300px] max-w-[600px]">
              <div
              className="relative mx-auto"
              style={{
                  width: "clamp(500px, min(40dvh, 40dvw), 400px)",
                  aspectRatio: "1 / 1",
                  borderRadius: "100% 30% 60% 70% / 50% 40% 70% 70%",
                  overflow: "hidden",
                  position: "relative",
              }}
              >
              {/* The photo */}
              <img
                  src={olgaInfo2}
                  alt="Olga"
                  style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  }}
              />

              {/* Overlay notes */}
              <p
                className="absolute bottom-60 left-38 transform -translate-x-1/2 
                          text-grey font-bold px-3 py-1 rounded-lg"
                style={{ 
                  textDecoration: "none", 
                  fontFamily: "'Etna Sans Serif', sans-serif", 
                  fontSize: "40px" 
                }}
              >
                NYC Movies
              </p>

              <p
                className="absolute bottom-43 left-45 transform -translate-x-1/2 
                          text-grey font-bold px-3 py-1 rounded-lg"
                style={{ 
                  textDecoration: "none", 
                  fontFamily: "'Etna Sans Serif', sans-serif", 
                  fontSize: "18px" 
                }}
              >
                Join our community of NYC moviegoers on Telegram 
              </p>

              {/* Overlay link */}
              <a
                href="https://t.me/kinovinobezzdomino"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-27 left-40 transform -translate-x-1/2 
                          text-blue-400 font-bold px-3 py-1 rounded-lg 
                          bg-white/50 hover:text-yellow-500"
                style={{ textDecoration: "none" }}
              >
                @kinovinobezzdomino
              </a>

              {/* Decorative blob layers */}
              <div
                  style={{
                  content: "''",
                  position: "absolute",
                  top: "-10%",
                  left: "-20%",
                  width: "90%",
                  aspectRatio: "1.2 / 1",
                  borderRadius: "50%",
                  background: "rgba(200,150,255,0.3)", // light accent
                  zIndex: -1,
                  }}
              />
              <div
                  style={{
                  content: "''",
                  position: "absolute",
                  top: "0%",
                  right: "-20%",
                  width: "90%",
                  aspectRatio: "1.2 / 1",
                  borderRadius: "52% 48% 35% 65% / 67% 49% 51% 33%",
                  background: "rgba(255,200,100,0.3)",
                  zIndex: -1,
                  }}
              />
              </div>  
                      
          </div>

          
        </div>

  <Footer />
      </div >



    </div>
  );
}
