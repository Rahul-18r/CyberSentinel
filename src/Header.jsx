import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            CyberSpy
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-indigo-400">
              Home
            </Link>
            <Link to="/features" className="hover:text-indigo-400">
              Features
            </Link>
            <Link to="/dashboard" className="hover:text-indigo-400">
              Dashboard
            </Link>
            <Link to="/contact" className="hover:text-indigo-400">
              Contact
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4">
            <Link
              to="/"
              className="block py-2 hover:text-indigo-400"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block py-2 hover:text-indigo-400"
            >
              Features
            </Link>
            <Link
              to="/dashboard"
              className="block py-2 hover:text-indigo-400"
            >
              Dashboard
            </Link>
            <Link
              to="/contact"
              className="block py-2 hover:text-indigo-400"
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
