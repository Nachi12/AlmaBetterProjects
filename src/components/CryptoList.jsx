/**
 * CryptoList: Displays a list of cryptocurrencies with market caps.
 * @module CryptoList
 */
import React from "react";
import { useSelector } from "react-redux";

/**
 * CryptoList component
 * @returns {JSX.Element} Rendered list of cryptocurrencies
 */
const CryptoList = () => {
  // State and Data Retrieval Section
  // --------------------------------
  // Retrieve filtered cryptocurrencies and base currency from Redux store
  const { filteredCryptos, baseCurrency } = useSelector(
    (state) => state.crypto
  );
  // Use filteredCryptos if available, otherwise default to empty array
  const cryptosToDisplay = filteredCryptos.length > 0 ? filteredCryptos : [];

  // Utility Functions Section
  // ------------------------
  // Format market cap value based on the selected currency
  const formatMarketCap = (marketCap) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: baseCurrency.toUpperCase(),
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(marketCap);
  };

  // Format percentage change to one decimal place for display
  const formatPercentage = (percentage) => {
    return Math.abs(percentage).toFixed(1);
  };

  // JSX Rendering Section
  // ---------------------
  return (
    // Main container for the cryptocurrency list
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-60">
      {/* Header Section */}
      {/* Display the title of the cryptocurrency list */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Cryptocurrency by market cap
        </h2>
      </div>

      {/* List Section */}
      {/* Render the list of cryptocurrencies or a fallback message if none available */}
      <div className="divide-y divide-gray-100">
        {cryptosToDisplay.length > 0 ? (
          // Map through cryptocurrencies to display each item
          cryptosToDisplay.map((crypto, index) => (
            <div
              key={crypto.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                {/* Crypto Info Section */}
                {/* Display cryptocurrency name and formatted market cap */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-base mb-1">
                    {crypto.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Mkt.Cap {formatMarketCap(crypto.market_cap)}
                  </div>
                </div>

                {/* Percentage Change Section */}
                {/* Display 24-hour price change percentage with color-coded styling */}
                <div className="flex items-center ml-4">
                  {crypto.price_change_percentage_24h !== undefined && (
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium ${
                        crypto.price_change_percentage_24h >= 0
                          ? "text-green-600 bg-green-50"
                          : "text-red-600 bg-red-50"
                      }`}
                    >
                      {/* Display triangle icon indicating price increase or decrease */}
                      <span
                        className={`inline-block w-0 h-0 ${
                          crypto.price_change_percentage_24h >= 0
                            ? "border-l-4 border-r-4 border-b-4 border-transparent border-b-green-600"
                            : "border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"
                        }`}
                      ></span>
                      {/* Display formatted percentage change */}
                      <span>
                        {formatPercentage(crypto.price_change_percentage_24h)} %
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Display fallback message when no cryptocurrencies are available
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No cryptocurrencies available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoList;