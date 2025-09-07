

import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Crypto Dashboard</h2>
      <ul>
        <li className="mb-4"><a href="#" className="hover:text-gray-300">Home</a></li>
        <li className="mb-4"><a href="#" className="hover:text-gray-300">Markets</a></li>
        <li className="mb-4"><a href="#" className="hover:text-gray-300">Portfolio</a></li>
        <li><a href="#" className="hover:text-gray-300">Settings</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;