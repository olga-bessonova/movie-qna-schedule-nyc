import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarCustomToolbar from './CalendarCustomToolbar'

const localizer = momentLocalizer(moment)


export default function MovieCalendar({ movies }) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedTheater, setSelectedTheater] = useState('All')

  const filteredMovies = 
    selectedTheater === "All"
    ? movies
    : movies.filter((m) => m.theater === selectedTheater)
  
  const events = (filteredMovies || [])
  .map((movie) => {
    const start = movie.start || movie.date;
    if (!start) return null;

    const startDate = moment(start, "YYYY-MM-DD").toDate();
    const endDate = startDate

    return {
      title: movie.title || "Untitled",
      start: startDate,
      end: endDate,
      allDay: true,
      theater: movie.theater
    };
  })
  .filter(Boolean);

  function getClosestEventMonth(events, fromDate, future = true) {
    if (!events || events.length === 0) return null;
  
    // sort by start date
    const sorted = [...events].sort((a, b) => a.start - b.start);
  
    if (future) {
      // next event after fromDate
      const next = sorted.find(e => e.start > fromDate);
      if (!next) return null;
      return moment(next.start).startOf("month").toDate();
    } else {
      // previous event before fromDate
      const prev = [...sorted].reverse().find(e => e.start < fromDate);
      if (!prev) return null;
      return moment(prev.start).startOf("month").toDate();
    }
  }
  


  return (
    <div className="w-full h-full max-w-5xl mx-auto bg-black rounded-2xl shadow-lg p-4">
     {/* <div className="w-full h-full bg-black rounded-2xl p-4">  */}
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        🎬 Q&A Movie Calendar
      </h2>

      {/* <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" */}
      <div className="rounded-xl overflow-hidden"
        style={{ height: view === "agenda" ? "300px" : "auto" }}
      >
        
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          view={view}
          // onView={(newView) => setView(newView)}
          onView={(newView) => {
            setView(newView);
            if (newView === "agenda") {
              setDate(moment(date).startOf("month").toDate());
            }
          }}
          defaultView="month"
          views={["month", "agenda"]}
        
          className="rbc-custom-calendar"
          formats={{
            agendaDateFormat: (date) =>
              moment(date).format("MMMM D, YYYY (dddd)"),
            agendaTimeFormat: () => "",
          }}

          messages={{
            noEventsInRange:
              date < new Date() ? (
                <div className="flex flex-col items-center text-white font-bold">
                  <p>That’s history! We only track upcoming Q&amp;A movies.</p>
                  <button
                    onClick={() => {
                      const closestMonth = getClosestEventMonth(events, date, true)
                      if (closestMonth) {
                        setDate(closestMonth)
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    See What's Next ▶
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-white font-bold">
                  <p>No Q&amp;A movies scheduled for these dates yet — check back soon!</p>
                  <button
                    onClick={() => {
                      const closestMonth = getClosestEventMonth(events, date, false)
                      if (closestMonth) {
                        setDate(closestMonth)
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Check Previous Month
                  </button>

                </div>
              ),
          }}
          
          components={{
            toolbar: (props) => (
              <CalendarCustomToolbar
                {...props}
                setSelectedTheater={setSelectedTheater}
                selectedTheater={selectedTheater}
              />
            ),
          }}
          eventPropGetter={(event) => {
            let style = {
              backgroundColor: "#dc2626", // AMC red by default
              // color: "white",
              // borderRadius: "0.375rem",
              // border: "2px solid black",
              // fontWeight: 600,
              // padding: "4px 6px",
            };
        
            if (event.theater === "IFC Center") {
              style.backgroundColor = "#16a34a"; // green-600
            }

            if (event.theater === "Angelika NYC") {
              style.backgroundColor = "#0096FF"; // blue
            }
        
            return { style };
          }}
          onSelectEvent={(event) => {
            const el = document.getElementById(`movie-${event.title.replace(/\s+/g, "-")}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
        />
      </div>

      <style>{`
        // Calendar overrides

        .rbc-toolbar {
          background: #f9fafb; 
          // border-bottom: 1px solid #e5e7eb; 
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .rbc-toolbar button, #movie_selector {
          background: #ffc211; 
          border-radius: 1rem;
          padding: 0.4rem 1rem;
          font-weight: 500;
          margin: 3px;
          border: none;
          transition: background 0.2s;
        }
        
        .rbc-toolbar button:hover {
          background:rgb(198, 149, 3); 
        }

        // .rbc-toolbar button:active,
        //  {
        //   // background:rgb(255, 239, 14) !important; /* red-600 */
        //   color:rgb(0, 0, 0) !important;
        //   font-weight: 800;
        //   outline: none !important;
        //   box-shadow: none !important;
        // }
        
        .rbc-off-range-bg {
          background-color: #f9fafb; 
        }

        .rbc-event {
          color: white;
          // border: 2px solid black;
          border-radius: 0.7rem;
          padding: 4px 6px;
          font-size: 0.875rem;
          font-weight: 600;
        }
        

        .rbc-month-row {
          min-height: 90px; /* give room to display events */
        }

        .rbc-agenda-view table thead th:nth-child(2),
        .rbc-agenda-time-cell {
          display: none !important;
        }
        
        .rbc-agenda-row {
          min-height: 300px; /* give room to display events */
        }



        .rbc-agenda-empty,
        .rbc-month-view,
        .rbc-month-view .rbc-row .rbc-row-content:only-child {
          // color:rgb(233, 139, 8); /* red-700 */
          // font-weight: 600;
          // font-size: 1rem;
          // text-align: center;
          // padding: 1rem;
          // background-color:rgb(177, 25, 25); /* red-50 */
          border-radius: 10px;
          border: none
        }

        .rbc-agenda-date-cell {
          background-color: white !important;
          color: black !important;
        }

        .rbc-agenda-event-cell {
          background-color: inherit !important;
          color: inherit !important;
        }

                .rbc-day-bg {
                
          background-color: #e3a4d3 !important; 
          // background-color:rgb(210, 168, 251) !important; 
          // border: 3px rgb(133, 23, 242) !important;
          // border: none !important
        }
        
        .rbc-month-row + .rbc-month-row {
  // border-top: none
}

.rbc-header {
  // border-bottom: px solid #DDD; /* top row under weekdays */
  border-top: none;
  border-left: none;
  border-right: none;
  border: none;
  color: white;
  padding: 2px;
  border-radius: 10px
}


.rbc-header + .rbc-header {
  border-left: none;  /* remove vertical separators between headers */
  // border-right: 3px white;
  }

.rbc-agenda-view .rbc-agenda-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;  /* fills available space */
}

// .rbc-agenda-view {
//   display: flex;
//   align-items: center;   /* vertical center */
//   justify-content: center; /* horizontal center */
//   height: 100%;          /* take full height of calendar container */
// }

// .rbc-agenda-empty {
//   text-align: center;
//   font-size: 1.2rem;
//   font-weight: 600;
//   color: white;
// }
        .rbc-today {
          background-color:rgb(225, 133, 202) !important; 
        }

      `}</style>
    </div>
  );
}
