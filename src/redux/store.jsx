import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Changed from 'import thunk from' to 'import { thunk } from'
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;