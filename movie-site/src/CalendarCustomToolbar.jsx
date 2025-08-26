export default function CalendarCustomToolbar({ label, onNavigate, onView, view, setSelectedTheater, selectedTheater }) {
  return (
    <div className="rbc-toolbar flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm">
      
      {/* Left: Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          ◀
        </button>

        <button
          onClick={() => onNavigate("TODAY")}
          className="px-4 py-1 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          Today
        </button>

        {/* Right: View buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onView("month")}
          className={`px-4 py-1 rounded-md transition ${
            view === "month"
              ? "bg-gray-800 text-white font-semibold"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onView("agenda")}
          className={`px-4 py-1 rounded-md transition ${
            view === "agenda"
              ? "bg-gray-800 text-white font-semibold"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Agenda
        </button>
      </div>

        <button
          onClick={() => onNavigate("NEXT")}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          ▶
        </button>

        {/* Current month/label */}
        <span className="ml-4 text-lg font-bold text-gray-800 px-10">{label}</span>
      </div>

      {/* Middle: Theater filter */}
      <div>
        <select
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
          className="bg-yellow-200 border border-gray-200 rounded-md px-3 py-1 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All Theaters</option>
          <option value="AMC">AMC</option>
          <option value="IFC Center">IFC Center</option>
        </select>
      </div>

      
    </div>
  );
}
