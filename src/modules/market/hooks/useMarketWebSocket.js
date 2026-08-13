import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateNiftyData,
  updateSensexData,
  setConnectionStatus,
  setMarketStatus,
  addTickLog,
} from '../store/marketSlice';
import parseMarketMessage from '../utils/parseMarketMessage';
import checkIsMarketOpen from '../utils/marketHours';
import { generateMockNiftyTick, generateMockSensexTick } from '../services/mockFeed';

const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000];

export function useMarketWebSocket() {
  const dispatch = useDispatch();
  const useMockFeed = useSelector((state) => state.market.useMockFeed);

  const niftySocketRef = useRef(null);
  const sensexSocketRef = useRef(null);
  const niftyRetryIdxRef = useRef(0);
  const sensexRetryIdxRef = useRef(0);
  const niftyTimeoutRef = useRef(null);
  const sensexTimeoutRef = useRef(null);
  const mockIntervalRef = useRef(null);

  useEffect(() => {
    // 1. Evaluate market hours
    const status = checkIsMarketOpen();
    dispatch(setMarketStatus({ isOpen: status.isOpen, reason: status.reason }));

    // Helper to clean up real sockets
    const closeSockets = () => {
      if (niftyTimeoutRef.current) clearTimeout(niftyTimeoutRef.current);
      if (sensexTimeoutRef.current) clearTimeout(sensexTimeoutRef.current);
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);

      if (niftySocketRef.current) {
        niftySocketRef.current.onopen = null;
        niftySocketRef.current.onmessage = null;
        niftySocketRef.current.onerror = null;
        niftySocketRef.current.onclose = null;
        niftySocketRef.current.close();
        niftySocketRef.current = null;
      }

      if (sensexSocketRef.current) {
        sensexSocketRef.current.onopen = null;
        sensexSocketRef.current.onmessage = null;
        sensexSocketRef.current.onerror = null;
        sensexSocketRef.current.onclose = null;
        sensexSocketRef.current.close();
        sensexSocketRef.current = null;
      }
    };

    // 2. MOCK FEED MODE
    if (useMockFeed) {
      closeSockets();
      dispatch(setConnectionStatus({ indexKey: 'nifty', status: 'mock' }));
      dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'mock' }));

      // Immediately push an initial tick
      const initNifty = parseMarketMessage(generateMockNiftyTick());
      if (initNifty) {
        dispatch(updateNiftyData(initNifty));
        dispatch(addTickLog({ id: Date.now() + '-nifty', ...initNifty }));
      }
      const initSensex = parseMarketMessage(generateMockSensexTick());
      if (initSensex) {
        dispatch(updateSensexData(initSensex));
        dispatch(addTickLog({ id: Date.now() + '-sensex', ...initSensex }));
      }

      // Interval mock tick updates every 1.5 seconds
      mockIntervalRef.current = setInterval(() => {
        const niftyTick = parseMarketMessage(generateMockNiftyTick());
        if (niftyTick) {
          dispatch(updateNiftyData(niftyTick));
          dispatch(addTickLog({ id: Date.now() + '-nifty', ...niftyTick }));
        }

        const sensexTick = parseMarketMessage(generateMockSensexTick());
        if (sensexTick) {
          dispatch(updateSensexData(sensexTick));
          dispatch(addTickLog({ id: Date.now() + '-sensex', ...sensexTick }));
        }
      }, 1500);

      return () => closeSockets();
    }

    // 3. IF MARKET IS CLOSED & MOCK FEED IS OFF
    if (!status.isOpen) {
      closeSockets();
      dispatch(setConnectionStatus({ indexKey: 'nifty', status: 'inactive' }));
      dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'inactive' }));
      return () => closeSockets();
    }

    // 4. LIVE WEBSOCKET MODE
    const connectNifty = () => {
      dispatch(setConnectionStatus({ indexKey: 'nifty', status: 'connecting' }));
      try {
        const ws = new WebSocket('wss://streamer.ysil.in/freefeed');
        niftySocketRef.current = ws;

        ws.onopen = () => {
          niftyRetryIdxRef.current = 0;
          dispatch(setConnectionStatus({ indexKey: 'nifty', status: 'connected' }));
          const subPayload = JSON.stringify({
            action: 'subscribe',
            type: 'freefeed',
            symbols: ['NSEIDX_26000'],
          });
          ws.send(subPayload);
        };

        ws.onmessage = (evt) => {
          const parsed = parseMarketMessage(evt.data);
          if (parsed) {
            dispatch(updateNiftyData(parsed));
            dispatch(addTickLog({ id: Date.now() + '-nifty', ...parsed }));
          }
        };

        ws.onerror = () => {
          dispatch(setConnectionStatus({ indexKey: 'nifty', status: 'error' }));
        };

        ws.onclose = () => {
          dispatch(setConnectionStatus({ indexKey: 'nifty', status: 'reconnecting' }));
          const delay =
            RECONNECT_DELAYS[
              Math.min(niftyRetryIdxRef.current, RECONNECT_DELAYS.length - 1)
            ];
          niftyRetryIdxRef.current += 1;
          niftyTimeoutRef.current = setTimeout(connectNifty, delay);
        };
      } catch (err) {
        dispatch(setConnectionStatus({ indexKey: 'nifty', status: 'error' }));
      }
    };

    const connectSensex = () => {
      dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'connecting' }));
      try {
        const ws = new WebSocket('wss://streamer.ysil.in/');
        sensexSocketRef.current = ws;

        ws.onopen = () => {
          sensexRetryIdxRef.current = 0;
          dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'connected' }));
          const subPayload = JSON.stringify({
            action: 'subscribe',
            type: 'freefeed',
            symbols: ['BSEIDX_1'],
          });
          ws.send(subPayload);
        };

        ws.onmessage = (evt) => {
          const parsed = parseMarketMessage(evt.data);
          if (parsed) {
            dispatch(updateSensexData(parsed));
            dispatch(addTickLog({ id: Date.now() + '-sensex', ...parsed }));
          }
        };

        ws.onerror = () => {
          dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'error' }));
        };

        ws.onclose = () => {
          dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'reconnecting' }));
          const delay =
            RECONNECT_DELAYS[
              Math.min(sensexRetryIdxRef.current, RECONNECT_DELAYS.length - 1)
            ];
          sensexRetryIdxRef.current += 1;
          sensexTimeoutRef.current = setTimeout(connectSensex, delay);
        };
      } catch (err) {
        dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'error' }));
      }
    };

    connectNifty();
    connectSensex();

    return () => closeSockets();
  }, [dispatch, useMockFeed]);
}

export default useMarketWebSocket;
