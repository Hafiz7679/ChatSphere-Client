import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";
import Logo from "../Logo/Logo";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-navy-900/80 border-b border-surface-700/20">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 py-4">

        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          <a href="#features" className="text-surface-400 hover:text-white transition">Features</a>
          <a href="#about" className="text-surface-400 hover:text-white transition">About</a>
          <a href="#tech" className="text-surface-400 hover:text-white transition">Tech Stack</a>
          <a href="#contact" className="text-surface-400 hover:text-white transition">Contact</a>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/admin/login"
            className="group relative flex items-center justify-center w-9 h-9 rounded-xl text-surface-400 hover:text-brand-300 hover:bg-brand-500/10 border border-transparent hover:border-brand-500/20 transition-all duration-200"
            title="Admin Login"
          >
            <HiShieldCheck className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-surface-800 text-[10px] font-medium text-surface-300 border border-surface-700/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
              Admin Login
            </span>
          </Link>
          <ThemeToggle />
          <Link to="/login" className="text-white hover:text-brand-400 transition font-medium">Log in</Link>
          <Link to="/register" className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-lg shadow-brand-600/25 hover:scale-105 transition duration-300">Get Started</Link>
        </div>

        <button className="lg:hidden text-white text-3xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

      </div>

      {menuOpen && (
        <div className="lg:hidden bg-navy-800/95 backdrop-blur-xl border-t border-surface-700/20">
          <div className="flex flex-col p-6 gap-6">
            <a href="#features" onClick={closeMenu} className="text-white">Features</a>
            <a href="#about" onClick={closeMenu} className="text-white">About</a>
            <a href="#tech" onClick={closeMenu} className="text-white">Tech Stack</a>
            <a href="#contact" onClick={closeMenu} className="text-white">Contact</a>
            <Link to="/admin/login" onClick={closeMenu} className="flex items-center gap-2 text-surface-400 hover:text-brand-300 transition">
              <HiShieldCheck className="w-4 h-4" />
              Admin Login
            </Link>
            <Link to="/login" onClick={closeMenu} className="text-white">Login</Link>
            <Link to="/register" onClick={closeMenu} className="bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-xl py-3 text-center font-semibold">Get Started</Link>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;