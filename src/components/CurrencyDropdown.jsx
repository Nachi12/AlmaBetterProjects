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
  const dispatch = useDispatch();
  const baseCurrency = useSelector((state) => state.crypto.baseCurrency);

  // Define a static list of currency codes
  const currencies = ["usd", "inr", "eur", "gbp", "jpy"];

  /**
   * Handle currency change event
   * @param {Object} e - The change event
   */
  const handleCurrencyChange = (e) => {
    dispatch(setBaseCurrency(e.target.value));
  };

  return (
    <select
      className="p-2 shadow-xs border-2 border-gray-200 rounded focus:outline-0 bg-blue-50 hover:bg-blue-200"
      value={baseCurrency}
      onChange={handleCurrencyChange}
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default CurrencyDropdown;
