import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";   
import About from "./About"; 

export default function App() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide nav
        setShowNav(false);
      } else {
        // scrolling up → show nav
        setShowNav(true);
      }
      setLastScrollY(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <Router>
      {/* Nav bar that hides on scroll down, shows on scroll up */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-20 py-4 bg-black text-white flex justify-between transition-transform duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link
          to="/"
          className="font-extrabold text-[#ffc211] text-[20px] hover:text-[#e3a4d3] transition-colors"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="font-extrabold text-[#ffc211] text-[20px] hover:text-[#e3a4d3] transition-colors"
        >
          About
        </Link>
      </nav>

      {/* Push content down so it’s not hidden behind fixed nav */}
      <div className="pt-15">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
