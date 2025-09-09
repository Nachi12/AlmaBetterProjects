/**
 * CurrencyDropdown: A dropdown component to select the base currency for conversions.
 * @module CurrencyDropdown
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBaseCurrency } from "../redux/actions/cryptoActions";

/**
 * CurrencyDropdown component
 * @returns {JSX.Element} Rendered dropdown component
 */
const CurrencyDropdown = () => {
  // State and Data Retrieval Section
  // --------------------------------
  // Initialize Redux dispatch for updating state
  const dispatch = useDispatch();
  // Retrieve the current base currency from Redux store
  const baseCurrency = useSelector((state) => state.crypto.baseCurrency);

  // Configuration Data Section
  // -------------------------
  // Define a static list of supported currency codes
  const currencies = ["usd", "inr", "eur", "gbp", "jpy"];

  // Event Handler Section
  // --------------------
  /**
   * Handle currency change event
   * @param {Object} e - The change event
   */
  const handleCurrencyChange = (e) => {
    // Dispatch action to update base currency in Redux store
    dispatch(setBaseCurrency(e.target.value));
  };

  // JSX Rendering Section
  // --------------------
  return (
    // Dropdown for selecting base currency
    <select
      className="p-2 shadow-xs border-2 border-gray-200 rounded focus:outline-0 bg-blue-50 hover:bg-blue-200"
      value={baseCurrency}
      onChange={handleCurrencyChange}
    >
      {/* Map through currencies to create dropdown options */}
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default CurrencyDropdown;