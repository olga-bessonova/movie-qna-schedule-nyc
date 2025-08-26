import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";   
import About from "./About"; 

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-black text-white flex justify-between">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
