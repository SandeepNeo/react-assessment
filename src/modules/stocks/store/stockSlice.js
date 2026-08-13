import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  availableStocks: [],
  selectedStocks: [],
  searchTerm: '',
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setAvailableStocks: (state, action) => {
      state.availableStocks = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addStock: (state, action) => {
      const newStock = action.payload;
      const exists = state.selectedStocks.some(
        (s) => s.symbol.toUpperCase() === newStock.symbol.toUpperCase()
      );
      if (!exists) {
        state.selectedStocks.push({
          ...newStock,
          updateDateTime: new Date().toISOString(),
        });
      }
    },
    updateStock: (state, action) => {
      const { symbol, field, value } = action.payload;
      const index = state.selectedStocks.findIndex(
        (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
      );
      if (index !== -1) {
        state.selectedStocks[index] = {
          ...state.selectedStocks[index],
          [field]: value,
          updateDateTime: new Date().toISOString(),
        };
      }
    },
    deleteStock: (state, action) => {
      const symbol = action.payload;
      state.selectedStocks = state.selectedStocks.filter(
        (s) => s.symbol.toUpperCase() !== symbol.toUpperCase()
      );
    },
    clearAllStocks: (state) => {
      state.selectedStocks = [];
    },
  },
});

export const {
  setAvailableStocks,
  setSearchTerm,
  addStock,
  updateStock,
  deleteStock,
  clearAllStocks,
} = stockSlice.actions;

export default stockSlice.reducer;
