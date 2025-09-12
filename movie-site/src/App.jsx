import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";   
import About from "./About"; 

export default function App() {
  return (
    <Router>
      {/* <nav className="sticky top-0 z-50 px-20 py-4 bg-black text-white flex justify-between"> */}
      <nav className="px-20 py-4 bg-black text-white flex justify-between">
        <Link to="/"
          className="font-extrabold text-[#ffc211] text-[20px] hover:text-[#e3a4d3] transition-colors">
            Home
        </Link>
        <Link to="/about"
          className="font-extrabold text-[#ffc211] text-[20px] hover:text-[#e3a4d3] transition-colors">
          About
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
