/**
 * Portfolio: Displays user investment in cryptocurrencies with a pie chart.
 * @module Portfolio
 */
import React from "react";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// ChartJS Configuration Section
// ----------------------------
// Register Chart.js components and data labels plugin for pie chart rendering
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

/**
 * Portfolio component
 * @returns {JSX.Element} Rendered portfolio overview with pie chart
 */
const Portfolio = () => {
  // Data Configuration Section
  // -------------------------
  // Dummy data for user investments (in USD)
  const investmentsUSD = [
    { id: "bitcoin", name: "Bitcoin", amount: 5000, value: 55000 },
    { id: "ethereum", name: "Ethereum", amount: 10000, value: 25000 },
    { id: "cardano", name: "Cardano", amount: 2000, value: 5000 },
  ];

  // State and Data Retrieval Section
  // -------------------------------
  // Retrieve base currency from Redux store
  const baseCurrency = useSelector((state) => state.crypto.baseCurrency);

  // Conversion Rates Section
  // -----------------------
  // Simple conversion rates for demonstration (approximate)
  const conversionRates = {
    usd: 1,
    inr: 83.5, // Approximate USD to INR rate
    eur: 0.85,
    gbp: 0.75,
    jpy: 150,
  };

  // Data Processing Section
  // ----------------------
  // Convert investment amounts and values based on selected base currency
  const conversionRate = conversionRates[baseCurrency.toLowerCase()] || 1;
  const investments = investmentsUSD.map((coin) => ({
    ...coin,
    value: coin.value * conversionRate,
    amount: coin.amount * conversionRate,
  }));

  // Calculate total investment value
  const totalInvestment = investments.reduce((sum, coin) => sum + coin.value, 0);

  // Chart Data Preparation Section
  // -----------------------------
  // Prepare data for the pie chart
  const chartData = {
    labels: investments.map((coin) => coin.name),
    datasets: [
      {
        data: investments.map((coin) => coin.value),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options Section
  // --------------------
  // Configure pie chart options for display
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Portfolio Allocation" },
      tooltip: {
        callbacks: {
          // Format tooltip to show currency value and percentage
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalInvestment) * 100).toFixed(2);
            return `${context.label}: ${baseCurrency.toUpperCase()} ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: { size: 14, weight: "bold" },
        // Format data labels to show currency and value
        formatter: (value) => `${baseCurrency.toUpperCase()} ${value.toLocaleString()}`,
        anchor: "center",
        align: "center",
        clamp: true,
      },
    },
  };

  // JSX Rendering Section
  // --------------------
  return (
    // Main container for the portfolio overview
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full border-4 border-gray-100">
      {/* Header Section */}
      {/* Display portfolio title */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Portfolio Overview</h2>
      {/* Display total investment value */}
      <p className="text-lg sm:text-xl text-gray-700 mb-6">
        Total Investment: <span className="font-semibold">{baseCurrency.toUpperCase()} {totalInvestment.toLocaleString()}</span>
      </p>

      {/* Pie Chart Section */}
      {/* Display pie chart of portfolio allocation */}
      <div className="h-64 sm:h-80 mb-6 flex justify-center">
        <Pie data={chartData} options={chartOptions} />
      </div>

    </div>
  );
};

export default Portfolio;