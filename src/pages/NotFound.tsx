import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-2 font-serif text-[#141414]">Page not found</h1>
      <p className="text-neutral-500 mb-6 font-sans">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="px-4 py-2 bg-[#141414] text-white rounded-lg font-sans font-semibold">Go home</Link>
    </div>
  );
};

export default NotFound;
