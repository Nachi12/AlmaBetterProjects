/**
 * Sidebar: A navigation component for the cryptocurrency dashboard.
 * @module Sidebar
 */
import React from "react";

/**
 * Sidebar component
 * @returns {JSX.Element} Rendered sidebar with navigation links
 */
const Sidebar = () => {
  // JSX Rendering Section
  // --------------------
  return (
    // Main container for the sidebar with fixed width and full height
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      {/* Header Section */}
      {/* Display the dashboard title */}
      <h2 className="text-2xl font-bold mb-6">Crypto Dashboard</h2>
      {/* Navigation Menu Section */}
      {/* List of navigation links */}
      <ul>
        <li className="mb-4">
          <a href="#" className="hover:text-gray-300">
            Home
          </a>
        </li>
        <li className="mb-4">
          <a href="#" className="hover:text-gray-300">
            Markets
          </a>
        </li>
        <li className="mb-4">
          <a href="#" className="hover:text-gray-300">
            Portfolio
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300">
            Settings
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;