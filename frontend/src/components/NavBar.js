// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="bg-gray-800 p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-white text-xl font-bold hover:text-gray-300 transition">
        Home
      </Link>
      <div className="flex gap-4">
        <Link to="/master-review" className="text-white hover:text-gray-300 transition">
          Master Review
        </Link>
        <Link to="/basic-review" className="text-white hover:text-gray-300 transition">
          Basic Review
        </Link>
        <Link to="/quick-score" className="text-white hover:text-gray-300 transition">
          Quick Score
        </Link>
        <Link to="/search" className="text-white hover:text-gray-300 transition">
          Search Reviews
        </Link>
        <Link to="/training" className="text-white hover:text-gray-300 transition">
          Terp Training
        </Link>
      </div>
    </div>
  </nav>
);

export default NavBar;
