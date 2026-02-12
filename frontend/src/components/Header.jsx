import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/context";

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
            src="/logo.png"
            alt="BookStore"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            Contact
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center gap-2 bg-surface/50 border border-white/10 px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all w-64"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              className="bg-transparent border-none outline-none text-sm text-text-main placeholder-text-muted w-full"
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-text-main line-clamp-1 max-w-[100px]">
                    {user?.name}
                  </span>
                  <span className="text-xs text-text-muted capitalize">
                    {user?.role || "Member"}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 ring-2 ring-background">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              </div>

              {/* Admin Dashboard Button */}
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="px-4 py-2 bg-surface hover:bg-surface-hover text-text-main text-xs font-semibold rounded-full border border-white/10 transition-all flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </button>
              )}

              {/* Cart Icon */}
              <Link to="/cart" className="relative cursor-pointer group">
                <div className="p-2 rounded-full hover:bg-surface transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-muted group-hover:text-primary transition-colors"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
                <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {user?.cart?.length || 0}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-text-muted hover:text-red-500 transition-colors"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-text-main hover:text-primary transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2.5 bg-primary hover:bg-indigo-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-text-main hover:bg-surface rounded-lg"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-surface/95 backdrop-blur-lg border-b border-surface p-4 flex flex-col gap-4 shadow-xl md:hidden">
          <Link
            to="/"
            className="text-text-muted hover:text-primary py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-text-muted hover:text-primary py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-text-muted hover:text-primary py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>

          <div className="h-px bg-white/10 my-1"></div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-text-main font-medium">
                    {user?.name}
                  </span>
                  <span className="text-text-muted text-xs capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setOpen(false);
                  }}
                  className="mx-4 py-2 bg-surface-hover text-text-main text-sm font-medium rounded-lg border border-white/5"
                >
                  Manage Dashboard
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="mx-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium rounded-lg transition-colors border border-red-500/20"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-4">
              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="w-full py-2.5 text-text-main bg-surface hover:bg-surface-hover rounded-lg border border-white/10 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setOpen(false);
                }}
                className="w-full py-2.5 text-white bg-primary hover:bg-indigo-600 rounded-lg shadow-lg shadow-primary/20 transition-all font-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
