"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-400">
                Band Mate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/musicians"
                className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Find Musicians
              </Link>
              <Link
                href="/venues"
                className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Find Venues
              </Link>
              <Link
                href="/about"
                className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
          <Link
            href="/"
            className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/musicians"
            className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Find Musicians
          </Link>
          <Link
            href="/venues"
            className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Find Venues
          </Link>
          <Link
            href="/about"
            className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </Link>

          {/* Mobile Auth */}
          <div className="pt-4 pb-3 border-t border-slate-700">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="block w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-base font-medium mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium mt-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
