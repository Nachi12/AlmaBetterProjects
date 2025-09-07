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

// Register Chart.js components and plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Portfolio = () => {
  // Dummy data for user investments (in USD)
  const investmentsUSD = [
    { id: "bitcoin", name: "Bitcoin", amount: 5000, value: 55000 },
    { id: "ethereum", name: "Ethereum", amount: 10000, value: 25000 },
    { id: "cardano", name: "Cardano", amount: 2000, value: 5000 },
  ];

  // Get base currency from Redux store
  const baseCurrency = useSelector((state) => state.crypto.baseCurrency);

  // Simple conversion rates (approximate for demonstration)
  const conversionRates = {
    usd: 1,
    inr: 83.5, // Approximate USD to INR rate
    eur: 0.85,
    gbp: 0.75,
    jpy: 150,
  };

  // Convert investments based on baseCurrency
  const conversionRate = conversionRates[baseCurrency.toLowerCase()] || 1;
  const investments = investmentsUSD.map((coin) => ({
    ...coin,
    value: coin.value * conversionRate,
    amount: coin.amount * conversionRate,
  }));

  // Calculate total investment
  const totalInvestment = investments.reduce((sum, coin) => sum + coin.value, 0);

  // Prepare chart data
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Portfolio Allocation" },
      tooltip: {
        callbacks: {
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
        formatter: (value) => `${baseCurrency.toUpperCase()} ${value.toLocaleString()}`,
        anchor: "center",
        align: "center",
        clamp: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full border-4 border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Portfolio Overview</h2>
      <p className="text-lg sm:text-xl text-gray-700 mb-6">
        Total Investment: <span className="font-semibold">{baseCurrency.toUpperCase()} {totalInvestment.toLocaleString()}</span>
      </p>

      {/* Pie Chart */}
      <div className="h-64 sm:h-80 mb-6 flex justify-center">
        <Pie data={chartData} options={chartOptions} />
      </div>

      {/* Investment Table */}
      {/* <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Coin</th>
            <th className="p-2 border">Amount Invested ({baseCurrency.toUpperCase()})</th>
            <th className="p-2 border">Current Value ({baseCurrency.toUpperCase()})</th>
            <th className="p-2 border">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((coin) => {
            const percentage = ((coin.value / totalInvestment) * 100).toFixed(2);
            return (
              <tr key={coin.id} className="border-t">
                <td className="p-2">{coin.name}</td>
                <td className="p-2">{baseCurrency.toUpperCase()} {coin.amount.toLocaleString()}</td>
                <td className="p-2">{baseCurrency.toUpperCase()} {coin.value.toLocaleString()}</td>
                <td className="p-2">{percentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </div>
  );
};

export default Portfolio;