/**
 * SearchBar: A component for searching cryptocurrencies.
 * @module SearchBar
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterCryptos } from '../redux/actions/cryptoActions';

/**
 * SearchBar component
 * @returns {JSX.Element} Rendered search input and button
 */
const SearchBar = () => {
  const dispatch = useDispatch();
  const { cryptos, filteredCryptos } = useSelector((state) => state.crypto);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Handle search input change
   * @param {Object} e - The change event
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handle search button click
   */
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const filtered = cryptos.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dispatch(filterCryptos(filtered));
    } else {
      dispatch(filterCryptos(cryptos)); // Reset to full list if search is empty
    }
  };

  // Reset filteredCryptos when cryptos change (e.g., on currency change)
  useEffect(() => {
    dispatch(filterCryptos(cryptos));
  }, [cryptos, dispatch]);

  return (
    <div className="flex space-x-2">
      <input 
        type="text"
        className="p-2  bg-white border-2 border-gray-200 rounded w-150 focus:outline-none  hover:bg-blue-100"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
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