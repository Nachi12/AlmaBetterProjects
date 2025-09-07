/**
 * Reducer for cryptocurrency data and settings.
 * @module cryptoReducer
 */
import {
  FETCH_CRYPTO_DATA_REQUEST,
  FETCH_CRYPTO_DATA_SUCCESS,
  FETCH_CRYPTO_DATA_FAILURE,
  SET_BASE_CURRENCY,
  FILTER_CRYPTOS,
} from '../actions/cryptoActions';

const initialState = {
  cryptos: [],
  filteredCryptos: [],
  baseCurrency: 'usd',
  loading: false,
  error: null,
};

/**
 * Crypto reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action object
 * @returns {Object} New state
 */
const cryptoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CRYPTO_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CRYPTO_DATA_SUCCESS:
      return { ...state, loading: false, cryptos: action.payload, filteredCryptos: action.payload };
    case FETCH_CRYPTO_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_BASE_CURRENCY:
      return { ...state, baseCurrency: action.payload };
    case FILTER_CRYPTOS:
      return { ...state, filteredCryptos: action.payload };
    default:
      return state;
  }
};

export default cryptoReducer;