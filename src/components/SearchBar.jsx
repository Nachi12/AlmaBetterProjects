/**
 * SearchBar: A component for searching cryptocurrencies.
 * @module SearchBar
 */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterCryptos } from "../redux/actions/cryptoActions";

/**
 * SearchBar component
 * @returns {JSX.Element} Rendered search input and button
 */
const SearchBar = () => {
  // State and Data Retrieval Section
  // -------------------------------
  // Initialize Redux dispatch for updating state
  const dispatch = useDispatch();
  // Retrieve cryptocurrencies and filtered cryptocurrencies from Redux store
  const { cryptos, filteredCryptos } = useSelector((state) => state.crypto);
  // State for the search input term
  const [searchTerm, setSearchTerm] = useState("");

  // Event Handler Section
  // --------------------
  /**
   * Handle search input change
   * @param {Object} e - The change event
   */
  const handleSearchChange = (e) => {
    // Update search term state with input value
    setSearchTerm(e.target.value);
  };

  /**
   * Handle search button click
   */
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Filter cryptocurrencies by name based on search term
      const filtered = cryptos.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Dispatch action to update filtered cryptocurrencies in Redux store
      dispatch(filterCryptos(filtered));
    } else {
      // Reset to full cryptocurrency list if search term is empty
      dispatch(filterCryptos(cryptos));
    }
  };

  // Effect Hook Section
  // ------------------
  // Reset filteredCryptos when cryptos change (e.g., on currency change)
  useEffect(() => {
    // Dispatch action to reset filtered cryptocurrencies to full list
    dispatch(filterCryptos(cryptos));
  }, [cryptos, dispatch]);

  // JSX Rendering Section
  // --------------------
  return (
    // Container for search input and button
    <div className="flex space-x-2">
      {/* Input field for searching cryptocurrencies by name */}
      <input
        type="text"
        className="p-2 bg-white border-2 border-gray-200 rounded w-150 focus:outline-none hover:bg-blue-100"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      {/* Button to trigger search */}
      <button
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-400"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;