import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, Zap } from 'lucide-react';

export default function IndexCard({ data, connectionStatus, symbolCode }) {
  const { name, value, percentChange, high, low, open, close, yearHigh, yearLow, lastUpdated } = data;
  const [flashClass, setFlashClass] = useState('');
  const prevValueRef = useRef(value);

  // Flash animation trigger when price updates
  useEffect(() => {
    if (value !== null && prevValueRef.current !== null && value !== prevValueRef.current) {
      const isUp = value > prevValueRef.current;
      setFlashClass(isUp ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300');
      const timer = setTimeout(() => setFlashClass(''), 800);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value]);

  const isPositive = (percentChange || 0) >= 0;

  // Calculate position percentage in Day's High-Low Range
  let rangePercent = 50;
  if (high && low && high > low && value) {
    rangePercent = Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100));
  }

  const getStatusBadge = () => {
    if (connectionStatus === 'connected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
        </span>
      );
    }
    if (connectionStatus === 'mock') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Zap size={12} className="text-amber-500" /> Simulated Feed
        </span>
      );
    }
    if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span> Reconnecting...
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-2 h-2 rounded-full bg-slate-400"></span> Disconnected
      </span>
    );
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-6 shadow-xs transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        flashClass || 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">{name}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
              {symbolCode}
            </span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Index Value & Change */}
        <div className="flex items-baseline justify-between gap-4 mt-2">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
              {value !== null ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--.--'}
            </div>
          </div>

          {percentChange !== null && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-extrabold shadow-2xs ${
                isPositive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{isPositive ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Intraday High / Low Progress Bar */}
      {high && low && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Low: <strong className="text-slate-800">${low.toFixed(2)}</strong></span>
            <span>Day's Range</span>
            <span>High: <strong className="text-slate-800">${high.toFixed(2)}</strong></span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${rangePercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Key Statistics Grid */}
      <div className="grid grid-cols-4 gap-2 mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Open</span>
          <span className="text-xs font-bold text-slate-800 font-mono">
            {open !== null ? open.toFixed(2) : '-'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Prev Close</span>
          <span className="text-xs font-bold text-slate-800 font-mono">
            {close !== null ? close.toFixed(2) : '-'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">52W High</span>
          <span className="text-xs font-bold text-slate-800 font-mono">
            {yearHigh !== null ? yearHigh.toFixed(2) : '-'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">52W Low</span>
          <span className="text-xs font-bold text-slate-800 font-mono">
            {yearLow !== null ? yearLow.toFixed(2) : '-'}
          </span>
        </div>
      </div>

      {/* Footer Timestamp */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <Clock size={13} />
          <span>Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Awaiting data...'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity size={13} className="text-brand-primary" />
          <span className="font-semibold text-slate-600">Feed Active</span>
        </div>
      </div>
    </div>
  );
}
