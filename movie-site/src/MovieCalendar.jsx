import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar'

const localizer = momentLocalizer(moment);

export default function MovieCalendar({ movies }) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedTheater, setSelectedTheater] = useState('All')

  const filteredMovies = 
    selectedTheater === "All"
    ? movies
    : movies.filter((m) => m.theater === selectedTheater)
  
  console.log("Theater:", selectedTheater)

  const events = (filteredMovies || [])
  .map((movie) => {
    const start = movie.start || movie.date;
    if (!start) return null;

    const startDate = moment(start, "YYYY-MM-DD").toDate();
    // add +1 day so it shows in month view
    const endDate = startDate
    // const endDate = moment(startDate).add(1, "days").toDate();

    return {
      title: movie.title || "Untitled",
      start: startDate,
      end: endDate,
      allDay: true,
      theater: movie.theater
    };
  })
  .filter(Boolean);

  console.log("Events:", events);


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
          onView={(newView) => setView(newView)}
          views={["month", "agenda"]}
          // views={["agenda"]}
          defaultView="month"
          className="rbc-custom-calendar"
          formats={{
            agendaDateFormat: (date) =>
              moment(date).format("MMMM D, YYYY (dddd)"),
            agendaTimeFormat: () => "",
          }}
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                setSelectedTheater={setSelectedTheater}
                selectedTheater={selectedTheater}
              />
            ),
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
          background: #dc2626 !important; /* red-600 */
          color: white !important;
          border: 2px solid black !important;
          border-radius: 0.375rem;
          padding: 4px 6px;
          font-size: 0.875rem;
          font-weight: 600;
          z-index: 999 !important;
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
      `}</style>
    </div>
  );
}
