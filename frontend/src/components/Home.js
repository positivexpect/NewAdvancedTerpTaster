import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-purple-600 to-pink-500 p-6 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-white mb-8">Welcome to Terp Taster</h1>
      
      <div className="grid gap-4 w-full max-w-md">
        <button
          onClick={() => navigate('/master-review')}
          className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-md w-full"
        >
          Master Review / Taste Score
        </button>
        <button
          onClick={() => navigate('/basic-review')}
          className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-md w-full"
        >
          Basic Review
        </button>
        <button
          onClick={() => navigate('/quick-score')}
          className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-md w-full"
        >
          Quick Terp Score
        </button>
        <button
          onClick={() => navigate('/search')}
          className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-md w-full"
        >
          Search Reviews
        </button>
        <button
          onClick={() => navigate('/training')}
          className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-md w-full"
        >
          Terp Training Game
        </button>
      </div>
    </div>
  );
};

export default Home;
