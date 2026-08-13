import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from '../modules/ecommerce/store/cartSlice';
import stockReducer from '../modules/stocks/store/stockSlice';
import marketReducer from '../modules/market/store/marketSlice';

const rootReducer = combineReducers({
  ecommerce: cartReducer,
  stocks: stockReducer,
  market: marketReducer,
});

export default rootReducer;

