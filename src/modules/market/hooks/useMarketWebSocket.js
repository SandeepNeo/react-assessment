import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  updateIndexData,
  setConnectionStatus,
  setMarketStatus,
  addTickLog,
} from '../store/marketSlice';
import parseMarketMessage from '../utils/parseMarketMessage';
import checkIsMarketOpen from '../utils/marketHours';

const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000];

export function useMarketWebSocket() {
  const dispatch = useDispatch();

  const niftySocketRef = useRef(null);
  const sensexSocketRef = useRef(null);
  const niftyRetryIdxRef = useRef(0);
  const sensexRetryIdxRef = useRef(0);
  const niftyTimeoutRef = useRef(null);
  const sensexTimeoutRef = useRef(null);

  useEffect(() => {
    // Evaluate market hours for header info
    const status = checkIsMarketOpen();
    dispatch(setMarketStatus({ isOpen: status.isOpen, reason: status.reason }));

    const closeSockets = () => {
      if (niftyTimeoutRef.current) clearTimeout(niftyTimeoutRef.current);
      if (sensexTimeoutRef.current) clearTimeout(sensexTimeoutRef.current);

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

    // LIVE WEBSOCKET CONNECTION TO REAL STREAMER
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
            symbols: ['NSEIDX_26000', 'NSEIDX_26009'],
          });
          ws.send(subPayload);
        };

        ws.onmessage = (evt) => {
          const parsed = parseMarketMessage(evt.data);
          if (parsed) {
            dispatch(updateIndexData(parsed));
            dispatch(addTickLog({ id: Date.now() + '-' + (parsed.code || 'nifty'), ...parsed }));
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
      } catch {
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
            dispatch(updateIndexData(parsed));
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
      } catch {
        dispatch(setConnectionStatus({ indexKey: 'sensex', status: 'error' }));
      }
    };

    connectNifty();
    connectSensex();

    return () => closeSockets();
  }, [dispatch]);
}

export default useMarketWebSocket;
