import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from '../modules/ecommerce/store/cartSlice';

const rootReducer = combineReducers({
  ecommerce: cartReducer,
});

export default rootReducer;
