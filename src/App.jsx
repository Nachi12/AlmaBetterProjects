import Logo from "./components/Logo";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCryptoData } from "./redux/actions/cryptoActions";
// import Sidebar from './components/Sidebar';
import CurrencyDropdown from "./components/CurrencyDropdown";
import CryptoList from "./components/CryptoList";
import ExchangeRates from "./components/ExchangeRates";
import ChartComponent from "./components/ChartComponent";
import SearchBar from "./components/SearchBar";
import ErrorBoundary from "./components/ErrorBoundary";
import Portfolio from "./components/Portfolio";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { cryptos, error } = useSelector((state) => state.crypto);
  const baseCurrency = useSelector((state) => state.crypto.baseCurrency);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchCryptoData(baseCurrency))
      .then(() => {
        console.log("Crypto data fetched:", cryptos);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, [baseCurrency, dispatch]);

  console.log("Current state:", { cryptos, error, baseCurrency }); // Debug log

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (isLoading) {
    return <div className="text-center">Loading data...</div>;
  }

  return (
    <>
      <div
        id="mainContainer"
        className="min-h-screen flex items-center justify-center mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full">
          <Logo />
          {/* <Sidebar /> */}
          <ErrorBoundary>
            <div
              id="TopBar"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl mx-auto mb-6"
            >
              <CurrencyDropdown />
              <SearchBar />
            </div>

            <div
              id="sub-container"
              className="flex flex-col lg:flex-row justify-between gap-6 w-full max-w-7xl mx-auto"
            >
              <div
                id="chartsection"
                className="flex flex-col md:flex-row md:flex-wrap justify-center lg:justify-start items-start gap-6 w-full lg:w-2/3"
              >
                <div className="w-full">
                  <ChartComponent />
                </div>
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <div className="w-full md:w-1/2">
                    <Portfolio />
                  </div>
                  <div className="w-full md:w-1/2">
                    <ExchangeRates />
                  </div>
                </div>
              </div>

              <div id="list" className="w-full lg:w-1/3">
                <CryptoList />
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

export default App;
