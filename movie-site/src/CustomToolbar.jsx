export default function CustomToolbar({ label, onNavigate, onView, view, setSelectedTheater, selectedTheater }) {
    return (
      <div className="rbc-toolbar flex justify-between items-center">
  
        {/* Middle: navigation (Today, Back, Next) */}
        <div className="flex items-center">
          <button onClick={() => onNavigate("TODAY")}>Today</button>
          <button onClick={() => onNavigate("PREV")}>Back</button>
          <button onClick={() => onNavigate("NEXT")}>Next</button>
          <span className="mx-2 font-bold">{label}</span>
        </div>

        {/* Left: Dropdown */}
        <div>
          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Theaters</option>
            <option value="AMC">AMC</option>
            <option value="IFC">IFC</option>
          </select>
        </div>
  
        {/* Right: view buttons (Month, Agenda) */}
        <div>
          <button
            onClick={() => onView("month")}
            className={view === "month" ? "rbc-active" : ""}
          >
            Month
          </button>
          <button
            onClick={() => onView("agenda")}
            className={view === "agenda" ? "rbc-active" : ""}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  }
  