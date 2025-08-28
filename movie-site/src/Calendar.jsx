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
    <div className="w-full h-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🎬 Q&A Movie Calendar
      </h2>

      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
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
                <div className="flex flex-col items-center space-y-2">
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
                <div className="flex flex-col items-center space-y-2">
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
              color: "white",
              borderRadius: "0.375rem",
              border: "2px solid black",
              fontWeight: 600,
              padding: "4px 6px",
            };
        
            if (event.theater === "IFC Center") {
              style.backgroundColor = "#16a34a"; // green-600
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
          border-bottom: 1px solid #e5e7eb; 
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .rbc-toolbar button {
          background: #ef4444; 
          border-radius: 0.5rem;
          padding: 0.25rem 0.75rem;
          font-weight: 500;
          margin: 0 0.25rem;
          transition: background 0.2s;
        }
        
        .rbc-toolbar button:hover {
          background:rgb(175, 29, 29); 
        }

        .rbc-toolbar button:active,
         {
          // background:rgb(255, 239, 14) !important; /* red-600 */
          color:rgb(0, 0, 0) !important;
          font-weight: 800;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .rbc-off-range-bg {
          background-color: #f9fafb; 
        }

        .rbc-event {
          color: white;
          border: 2px solid black;
          border-radius: 0.375rem;
          padding: 4px 6px;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .rbc-day-bg {
          background-color:rgb(233, 192, 192) !important; 
        }
        
        .rbc-month-row {
          min-height: 100px; /* give room to display events */
        }

        .rbc-agenda-time-cell {
          display: none !important;
        }
        
        .rbc-agenda-view table thead th:nth-child(2) {
          display: none !important; /* hide Time header */
        }
        
        .rbc-agenda-row {
          min-height: 300px; /* give room to display events */
        }

        .rbc-today {
          background-color:rgb(234, 166, 166) !important; 
        }

        .rbc-agenda-empty,
        .rbc-month-view .rbc-row .rbc-row-content:only-child {
          color:rgb(233, 139, 8); /* red-700 */
          font-weight: 600;
          font-size: 1rem;
          text-align: center;
          padding: 1rem;
          background-color: #fef2f2; /* red-50 */
          border-radius: 0.5rem;
        }

        .rbc-agenda-date-cell {
          background-color: white !important;
          color: black !important;
        }

        .rbc-agenda-event-cell {
          background-color: inherit !important;
          color: inherit !important;
        }

      `}</style>
    </div>
  );
}
