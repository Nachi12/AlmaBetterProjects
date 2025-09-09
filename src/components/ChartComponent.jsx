/**
 * ChartComponent: Displays cryptocurrency market trends with various chart types.
 * @module ChartComponent
 */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Line, Bar, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ChartJS Configuration Section
// ----------------------------
// Register required Chart.js components for rendering various chart types
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Unregister data labels plugin if it exists to prevent unwanted labels
if (ChartJS.registry.plugins.get("datalabels")) {
  ChartJS.unregister(ChartJS.registry.plugins.get("datalabels"));
}

const ChartComponent = () => {
  // State and Data Retrieval Section
  // --------------------------------
  // Retrieve crypto data and base currency from Redux store
  const { cryptos, baseCurrency } = useSelector((state) => state.crypto);
  // State for selected cryptocurrencies to track
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  // State for selected time range (in days)
  const [timeRange, setTimeRange] = useState("30");
  // State for custom date range
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  // State for chart data to be rendered
  const [chartData, setChartData] = useState(null);
  // State to manage loading status during data fetching
  const [loading, setLoading] = useState(false);
  // State for selected chart type (e.g., line, bar)
  const [chartType, setChartType] = useState("line");
  // State for selected currency for market data
  const [selectedCurrency, setSelectedCurrency] = useState(
    baseCurrency || "usd"
  );

  // Configuration Data Section
  // -------------------------
  // Available currencies for market data display
  const currencies = [
    { value: "usd", label: "USD ($)" },
    { value: "eur", label: "EUR (€)" },
    { value: "gbp", label: "GBP (£)" },
    { value: "jpy", label: "JPY (¥)" },
    { value: "btc", label: "BTC" },
    { value: "eth", label: "ETH" },
  ];

  // Available chart types and their corresponding components
  const chartTypes = [
    { value: "line", label: "Line Chart", component: Line },
    { value: "bar", label: "Bar Chart", component: Bar },
    { value: "doughnut", label: "Doughnut Chart", component: Doughnut },
    { value: "radar", label: "Radar Chart", component: Radar },
    { value: "polarArea", label: "Polar Area Chart", component: PolarArea },
  ];

  // Mapping of time range labels to days for API queries
  const timeRangeMap = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
  };

  // Event Handler Section
  // --------------------
  // Handle selection of a new cryptocurrency
  const handleCryptoSelect = (e) => {
    const cryptoId = e.target.value;
    if (cryptoId && !selectedCryptos.includes(cryptoId)) {
      setSelectedCryptos((prev) => [...prev, cryptoId]);
    }
    e.target.value = "";
  };

  // Remove a cryptocurrency from the selected list
  const removeCrypto = (id) => {
    setSelectedCryptos((prev) => prev.filter((c) => c !== id));
  };

  // Data Fetching Section
  // --------------------
  // Fetch market data for selected cryptocurrencies when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCryptos.length === 0) {
        setChartData(null);
        return;
      }

      setLoading(true);

      try {
        // Fetch market cap data for each selected cryptocurrency
        const datasets = await Promise.all(
          selectedCryptos.map(async (id, index) => {
            let url;

            // Determine API URL based on custom date range or predefined time range
            if (dateRange.start && dateRange.end) {
              const from = Math.floor(
                new Date(dateRange.start).getTime() / 1000
              );
              const to = Math.floor(new Date(dateRange.end).getTime() / 1000);
              url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=${selectedCurrency}&from=${from}&to=${to}`;
            } else {
              url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${selectedCurrency}&days=${timeRange}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            const values = data.market_caps.map((entry) => entry[1]);

            // Define color palette for chart datasets
            const colors = [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ];

            return {
              label: cryptos.find((c) => c.id === id)?.name || "Unknown",
              data: values,
              borderColor: colors[index % colors.length],
              backgroundColor: "rgba(0,0,0,0)",
              borderWidth: 2,
              fill: false,
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointBackgroundColor: colors[index % colors.length],
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
            };
          })
        );

        let labels = [];
        if (datasets.length > 0) {
          const firstCryptoId = selectedCryptos[0];
          let url;

          // Fetch labels (dates) for the first selected cryptocurrency
          if (dateRange.start && dateRange.end) {
            const from = Math.floor(new Date(dateRange.start).getTime() / 1000);
            const to = Math.floor(new Date(dateRange.end).getTime() / 1000);
            url = `https://api.coingecko.com/api/v3/coins/${firstCryptoId}/market_chart/range?vs_currency=${selectedCurrency}&from=${from}&to=${to}`;
          } else {
            url = `https://api.coingecko.com/api/v3/coins/${firstCryptoId}/market_chart?vs_currency=${selectedCurrency}&days=${timeRange}`;
          }

          const res = await fetch(url);
          const data = await res.json();

          // Generate labels from timestamps
          const rawLabels = data.market_caps.map((entry) =>
            new Date(entry[0]).toLocaleDateString()
          );

          // Reduce label density for better readability
          const step = Math.ceil(rawLabels.length / 15);
          labels = rawLabels.filter((_, index) => index % step === 0);
        }

        // Set chart data with labels and datasets
        setChartData({
          labels,
          datasets,
        });
      } catch (err) {
        console.error("Error fetching crypto data:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedCryptos, timeRange, dateRange, selectedCurrency, cryptos]);

  // Chart Options Section
  // --------------------
  // Define chart options based on chart type
  const getChartOptions = () => {
    // Base options for line and bar charts
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      layout: {
        padding: 10,
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        title: {
          display: true,
          text: `Crypto Market Cap Trends (${
            currencies.find((c) => c.value === selectedCurrency)?.label
          })`,
          padding: 20,
          font: {
            size: 16,
          },
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#ddd",
          borderWidth: 1,
          callbacks: {
            // Format tooltip to show currency values
            label: function (context) {
              return `${context.dataset.label}: ${new Intl.NumberFormat(
                "en-US",
                {
                  style: "currency",
                  currency: selectedCurrency.toUpperCase(),
                  notation: "compact",
                  maximumFractionDigits: 2,
                }
              ).format(context.parsed.y)}`;
            },
          },
        },
        datalabels: {
          display: false,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true,
            color: "rgba(0,0,0,0.05)",
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 10,
            color: "#666",
            font: {
              size: 12,
            },
          },
          border: {
            display: false,
          },
        },
        y: {
          display: true,
          grid: {
            display: true,
            color: "rgba(0,0,0,0.05)",
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 6,
            color: "#666",
            font: {
              size: 12,
            },
            // Format y-axis ticks as currency
            callback: function (value) {
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: selectedCurrency.toUpperCase(),
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value);
            },
          },
          border: {
            display: false,
          },
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
          borderWidth: 2,
        },
        line: {
          borderWidth: 2,
        },
      },
    };

    // Options for doughnut and polarArea charts
    if (chartType === "doughnut" || chartType === "polarArea") {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
          title: {
            display: true,
            text: `Current Market Cap Distribution (${
              currencies.find((c) => c.value === selectedCurrency)?.label
            })`,
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              // Format tooltip for single values
              label: function (context) {
                return `${context.label}: ${new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: selectedCurrency.toUpperCase(),
                  notation: "compact",
                  maximumFractionDigits: 2,
                }).format(context.parsed)}`;
              },
            },
          },
          datalabels: {
            display: false,
          },
        },
      };
    }

    // Options for radar chart
    if (chartType === "radar") {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
          title: {
            display: true,
            text: `Market Cap Comparison (${
              currencies.find((c) => c.value === selectedCurrency)?.label
            })`,
            font: {
              size: 16,
            },
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: "rgba(0,0,0,0.1)",
            },
            ticks: {
              // Format radial axis ticks
              callback: function (value) {
                return new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value);
              },
              backdropColor: "rgba(255,255,255,0.8)",
              color: "#666",
            },
          },
        },
      };
    }

    return baseOptions;
  };

  // Data Processing Section
  // ----------------------
  // Select the appropriate chart component based on chart type
  const ChartComponent =
    chartTypes.find((type) => type.value === chartType)?.component || Line;

  // Get latest market cap data for doughnut and polarArea charts
  const getCurrentMarketCapData = () => {
    if (!chartData || !chartData.datasets) return null;

    const latestValues = chartData.datasets.map((dataset) => {
      const latestValue = dataset.data[dataset.data.length - 1];
      return latestValue || 0;
    });

    return {
      labels: chartData.datasets.map((dataset) => dataset.label),
      datasets: [
        {
          data: latestValues,
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Prepare data for display based on chart type
  const getDisplayData = () => {
    if (chartType === "doughnut" || chartType === "polarArea") {
      return getCurrentMarketCapData();
    }
    if (chartType === "radar") {
      const currentData = getCurrentMarketCapData();
      if (!currentData) return null;

      return {
        labels: currentData.labels,
        datasets: chartData.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: [currentData.datasets[0].data[index]],
          backgroundColor: dataset.borderColor + "40",
          borderColor: dataset.borderColor,
          borderWidth: 2,
        })),
      };
    }
    return chartData;
  };

  // JSX Rendering Section
  // --------------------
  return (
    // Main container for the chart component
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-8xl border-2 border-gray-200 m-2 ">
      {/* Controls Section */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        {/* Currency and Chart Type Dropdowns */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6">
          {/* Currency selection dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="font-semibold text-gray-700">Currency:</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg  cursor-pointer focus:border-blue-500 focus:outline-none w-full sm:w-40 bg-white hover:bg-blue-50"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          {/* Chart type selection dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="font-semibold text-gray-700">Chart Type:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg  cursor-pointer focus:border-blue-500 focus:outline-none w-full sm:w-40 bg-white hover:bg-blue-50"
            >
              {chartTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Crypto Selection */}
          <div className="w-full">
            <div className="flex items-center gap-3">
              <select
                defaultValue=""
                onChange={handleCryptoSelect}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white cursor-pointer focus:border-blue-500 focus:outline-none w-full hover:bg-blue-50"
              >
                <option value="" disabled>
                  {selectedCryptos.length > 0
                    ? `${selectedCryptos
                        .map((id) => cryptos.find((c) => c.id === id)?.name)
                        .filter((name) => name)
                        .join(", ")}`
                    : selectedCryptos.length === 0
                    ? "Select a cryptocurrency..."
                    : `Add another cryptocurrency... (${
                        cryptos.filter(
                          (crypto) => !selectedCryptos.includes(crypto.id)
                        ).length
                      } remaining)`}
                </option>
                {cryptos
                  .filter((crypto) => !selectedCryptos.includes(crypto.id))
                  .map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} -{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: selectedCurrency.toUpperCase(),
                        notation: "compact",
                        maximumFractionDigits: 2,
                      }).format(crypto.market_cap)}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Time Range Controls - Only for Line and Bar Charts */}
        {(chartType === "line" || chartType === "bar") && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
            <span className="font-semibold text-gray-700">Time Range:</span>
            {["1D", "1W", "1M", "6M", "1Y"].map((range) => (
              <button
                key={range}
                onClick={() => {
                  setDateRange({ start: "", end: "" });
                  setTimeRange(timeRangeMap[range]);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  timeRange === timeRangeMap[range] && !dateRange.start
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {range}
              </button>
            ))}

            {/* Custom Date Range */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-0 sm:ml-4 p-2 border-2 border-gray-300 rounded-lg bg-white w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-600">Custom:</span>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-2 py-1 border border-gray-300 rounded cursor-pointer text-sm focus:outline-none focus:border-blue-500 w-full sm:w-32 hover:bg-blue-50"
              />
              <span className="text-gray-400 hidden sm:inline">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-2 py-1 border border-gray-300 rounded cursor-pointer text-sm focus:outline-none focus:border-blue-500 w-full sm:w-32 hover:bg-blue-50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Chart Display */}
      <div className="mt-6">
        {loading ? (
          // Display loading spinner while fetching data
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4 text-lg">Loading chart data...</p>
          </div>
        ) : chartData ? (
          // Render the selected chart type with data and options
          <div className="h-80 sm:h-96 bg-white p-4 border border-gray-200 rounded-lg">
            <ChartComponent
              data={getDisplayData()}
              options={getChartOptions()}
            />
          </div>
        ) : (
          // Display placeholder when no cryptocurrencies are selected
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-400 text-6xl mb-4">📈</div>
            <p className="text-gray-600 text-lg">
              Select at least one cryptocurrency to view chart
            </p>
          </div>
        )}
      </div>

      {/* Selected Cryptos Summary */}
      {selectedCryptos.length > 0 && (
        // Display selected cryptocurrencies with remove buttons
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-3 text-gray-800">
            Tracking {selectedCryptos.length} Cryptocurrenc
            {selectedCryptos.length === 1 ? "y" : "ies"}:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedCryptos.map((id) => {
              const crypto = cryptos.find((c) => c.id === id);
              return crypto ? (
                <span
                  key={id}
                  className="px-3 py-2 bg-white text-blue-800 rounded-full text-sm font-medium border border-blue-200 shadow-sm flex items-center gap-2"
                >
                  {crypto.name}
                  <button
                    onClick={() => removeCrypto(id)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartComponent;