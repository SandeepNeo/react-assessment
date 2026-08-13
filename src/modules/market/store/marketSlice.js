import { createSlice } from '@reduxjs/toolkit';

const initialIndexState = {
  name: '',
  value: null,
  percentChange: null,
  high: null,
  low: null,
  open: null,
  close: null,
  yearHigh: null,
  yearLow: null,
  lastUpdated: null,
};

const initialState = {
  nifty50: { ...initialIndexState, name: 'Nifty 50' },
  sensex: { ...initialIndexState, name: 'Sensex' },
  connection: {
    nifty: 'disconnected',
    sensex: 'disconnected',
  },
  isMarketOpen: true,
  marketReason: 'Evaluating market status...',
  useMockFeed: import.meta.env?.VITE_USE_MOCK_FEED === 'true',
  tickLogs: [],
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    updateNiftyData: (state, action) => {
      state.nifty50 = {
        ...state.nifty50,
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      };
    },
    updateSensexData: (state, action) => {
      state.sensex = {
        ...state.sensex,
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      };
    },
    setConnectionStatus: (state, action) => {
      const { indexKey, status } = action.payload; // indexKey: 'nifty' | 'sensex'
      state.connection[indexKey] = status;
    },
    setMarketStatus: (state, action) => {
      const { isOpen, reason } = action.payload;
      state.isMarketOpen = isOpen;
      state.marketReason = reason;
    },
    toggleMockFeed: (state, action) => {
      state.useMockFeed = action.payload !== undefined ? action.payload : !state.useMockFeed;
    },
    addTickLog: (state, action) => {
      state.tickLogs.unshift(action.payload);
      if (state.tickLogs.length > 20) {
        state.tickLogs.pop();
      }
    },
    clearTickLogs: (state) => {
      state.tickLogs = [];
    },
  },
});

export const {
  updateNiftyData,
  updateSensexData,
  setConnectionStatus,
  setMarketStatus,
  toggleMockFeed,
  addTickLog,
  clearTickLogs,
} = marketSlice.actions;

export default marketSlice.reducer;
