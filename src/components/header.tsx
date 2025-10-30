import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 1. Import useLocation
import logoImage from '../assets/logo.png'; // Assuming your logo path
import { useSearch } from '../context/SearchContext';

// --- Logo Component ---
// FIX: Using 'h-10 w-auto' to prevent the logo from being compressed
const Logo = () => (
  <Link to="/" className="flex items-center space-x-2">
    <img src={logoImage} alt="Highway Delite" className="h-10 w-auto" />
    <span className="font-bold text-xl">Highway Delite</span>
  </Link>
);

// --- Search Bar (for Home Page) ---
const SearchBar = () => {
  const { setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(localQuery);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-md space-x-2">
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search experiences"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button
        onClick={handleSearch}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg shadow"
      >
        Search
      </button>
    </div>
  );
};

// --- Search Button (for all other pages) ---
const SearchButton = () => (
  <Link to="/">
    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg shadow">
      Search
    </button>
  </Link>
);

// --- Main Header Component ---
export const Header = () => {
  // 2. Get the current page's location
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    // FIX: Using 'shadow-sm' for the "blackish effect"
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo */}
          <Logo />

          {/* 3. Conditionally show SearchBar or SearchButton */}
          {isHomePage ? <SearchBar /> : <SearchButton />}
        </div>
      </div>
    </nav>
  );
};