import { createSlice } from '@reduxjs/toolkit';

const initialIndexState = {
  name: '',
  value: null,
  percentChange: null,
  change: null,
  high: null,
  low: null,
  open: null,
  close: null,
  yearHigh: null,
  yearLow: null,
  upMoves: null,
  downMoves: null,
  lastUpdated: null,
};

const initialState = {
  nifty50: { ...initialIndexState, name: 'Nifty 50', code: '26000', type: 'NSEIDX', id: 'NSEIDX_26000' },
  sensex: { ...initialIndexState, name: 'Sensex', code: '1', type: 'BSEIDX', id: 'BSEIDX_1' },
  indices: {
    NSEIDX_26000: { ...initialIndexState, name: 'Nifty 50', code: '26000', type: 'NSEIDX', id: 'NSEIDX_26000' },
    BSEIDX_1: { ...initialIndexState, name: 'Sensex', code: '1', type: 'BSEIDX', id: 'BSEIDX_1' },
  },
  connection: {
    nifty: 'disconnected',
    sensex: 'disconnected',
  },
  isMarketOpen: true,
  marketReason: 'Evaluating market status...',
  tickLogs: [],
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    updateIndexData: (state, action) => {
      const data = action.payload;
      if (!data || !data.id) return;

      const key = data.id;
      const prev = state.indices[key] || {};

      let tickDirection = 'neutral';
      if (prev.value != null && data.value != null) {
        if (data.value > prev.value) tickDirection = 'up';
        else if (data.value < prev.value) tickDirection = 'down';
      }

      const updated = {
        ...prev,
        ...data,
        tickDirection,
        lastUpdated: data.timestamp || new Date().toISOString(),
      };

      state.indices[key] = updated;

      if (data.code === '26000' || data.name === 'Nifty 50' || data.name === 'Nifty50') {
        state.nifty50 = updated;
      } else if (data.code === '1' || data.name === 'Sensex') {
        state.sensex = updated;
      }
    },
    updateNiftyData: (state, action) => {
      const updated = {
        ...state.nifty50,
        ...action.payload,
        id: 'NSEIDX_26000',
        lastUpdated: action.payload.timestamp || new Date().toISOString(),
      };
      state.nifty50 = updated;
      state.indices['NSEIDX_26000'] = updated;
    },
    updateSensexData: (state, action) => {
      const updated = {
        ...state.sensex,
        ...action.payload,
        id: 'BSEIDX_1',
        lastUpdated: action.payload.timestamp || new Date().toISOString(),
      };
      state.sensex = updated;
      state.indices['BSEIDX_1'] = updated;
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
    addTickLog: (state, action) => {
      const uniqueId = `${action.payload.id || 'tick'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      state.tickLogs.unshift({
        ...action.payload,
        logId: uniqueId,
      });
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
  updateIndexData,
  updateNiftyData,
  updateSensexData,
  setConnectionStatus,
  setMarketStatus,
  addTickLog,
  clearTickLogs,
} = marketSlice.actions;

export default marketSlice.reducer;
