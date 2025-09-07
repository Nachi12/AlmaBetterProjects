import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ExchangeRates = () => {
  const { cryptos, baseCurrency } = useSelector((state) => state.crypto);
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Get available balance for selected currency (mock data for demo)
  const getAvailableBalance = (currency) => {
    const balances = {
      'BTC': '0.0002',
      'ETH': '23000',
      'ADA': '1500',
      'DOT': '500',
      'LINK': '100'
    };
    return balances[currency] || '0';
  };

  const handleConvert = () => {
    if (!amount || !/^\d*\.?\d*$/.test(amount)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setError('');
    
    try {
      const fromCrypto = cryptos.find((c) => c.symbol.toUpperCase() === fromCurrency);
      const toCrypto = cryptos.find((c) => c.symbol.toUpperCase() === toCurrency);
      
      if (!fromCrypto) {
        setError('From currency not found');
        return;
      }

      let toPrice;
      if (toCurrency === baseCurrency.toUpperCase()) {
        toPrice = 1;
      } else if (toCrypto) {
        toPrice = toCrypto.current_price;
      } else {
        setError('To currency not found');
        return;
      }

      const converted = (parseFloat(amount) * fromCrypto.current_price) / toPrice;
      setResult(converted);
    } catch (err) {
      setError('Conversion failed. Please try again.');
    }
  };

  const formatResult = (value, currency) => {
    if (currency === baseCurrency.toUpperCase()) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: baseCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      }).format(value);
    }
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${currency}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full border-4 border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Exchange Coins</h2>
      </div>

      {/* Sell Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-orange-500 font-medium text-sm">Sell</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          <select
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:border-blue-500 focus:outline-none appearance-none bg-no-repeat bg-right pr-8 hover:bg-blue-100"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.symbol.toUpperCase()}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
          
          <input
            type="text"
            className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg text-right font-medium focus:border-blue-500 bg-white focus:outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter value"
          />
        </div>
        
        <div className="text-right text-sm text-gray-500">
          Avl: {getAvailableBalance(fromCurrency)} {fromCurrency}
        </div>
      </div>

      {/* Buy Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-green-500 font-medium text-sm">Buy</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          <select
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:border-blue-500 focus:outline-none appearance-none bg-no-repeat bg-right pr-8 hover:bg-blue-100"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.symbol.toUpperCase()}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
            <option value={baseCurrency.toUpperCase()}>{baseCurrency.toUpperCase()}</option>
          </select>
          
          <div className="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 text-right font-medium text-gray-700">
            {result ? formatResult(result, toCurrency) : '0.00'}
          </div>
        </div>
        
        <div className="text-right text-sm text-gray-500">
          {getAvailableBalance(toCurrency)} {toCurrency}
        </div>
      </div>

      {/* Exchange Button */}
      <div className="mb-4">
        <button 
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          onClick={handleConvert}
        >
          Exchange
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Conversion Result */}
      {result && !error && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Conversion Result</p>
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              {amount} {fromCurrency} = {formatResult(result, toCurrency)}
            </p>
          </div>
        </div>
      )}

      {/* Exchange Rate Info */}
      {amount && !error && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-500 text-center">
            <p>Exchange rates are updated in real-time</p>
            <p>1 {fromCurrency} ≈ {cryptos.find(c => c.symbol.toUpperCase() === fromCurrency)?.current_price.toLocaleString()} {baseCurrency.toUpperCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeRates;