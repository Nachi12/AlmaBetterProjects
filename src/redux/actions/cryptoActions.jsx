/**
 * Actions for cryptocurrency data management.
 * @module cryptoActions
 */
import axios from 'axios';

export const FETCH_CRYPTO_DATA_REQUEST = 'FETCH_CRYPTO_DATA_REQUEST';
export const FETCH_CRYPTO_DATA_SUCCESS = 'FETCH_CRYPTO_DATA_SUCCESS';
export const FETCH_CRYPTO_DATA_FAILURE = 'FETCH_CRYPTO_DATA_FAILURE';
export const SET_BASE_CURRENCY = 'SET_BASE_CURRENCY';
export const FILTER_CRYPTOS = 'FILTER_CRYPTOS';

/**
 * Fetch cryptocurrency data
 * @param {string} baseCurrency - The base currency for pricing
 * @returns {Function} Thunk action
 */
export const fetchCryptoData = (baseCurrency) => async (dispatch) => {
  dispatch({ type: FETCH_CRYPTO_DATA_REQUEST });
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: baseCurrency,
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });
    dispatch({
      type: FETCH_CRYPTO_DATA_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CRYPTO_DATA_FAILURE,
      payload: error.message,
    });
  }
};

/**
 * Set the base currency
 * @param {string} currency - The new base currency
 * @returns {Object} Action object
 */
export const setBaseCurrency = (currency) => ({
  type: SET_BASE_CURRENCY,
  payload: currency,
});

/**
 * Filter cryptocurrencies based on search term
 * @param {Array} filtered - Filtered list of cryptocurrencies
 * @returns {Object} Action object
 */
export const filterCryptos = (filtered) => ({
  type: FILTER_CRYPTOS,
  payload: filtered,
}); 