import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTickLogs } from '../store/marketSlice';
import { Terminal, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TickLog() {
  const dispatch = useDispatch();
  const tickLogs = useSelector((state) => state.market.tickLogs);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Terminal size={14} />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Real-Time WebSocket Tick Feed Log</h3>
          <span className="text-xs text-slate-400 font-medium">({tickLogs.length} updates recorded)</span>
        </div>

        {tickLogs.length > 0 && (
          <button
            onClick={() => dispatch(clearTickLogs())}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={12} /> Clear Log
          </button>
        )}
      </div>

      {tickLogs.length === 0 ? (
        <div className="p-8 text-center text-xs font-medium text-slate-400 bg-slate-50/50 rounded-xl border border-slate-100">
          Waiting for incoming market feed ticks...
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 font-mono text-xs">
          {tickLogs.map((log, idx) => {
            const isUp = (log.percentChange || 0) >= 0;
            const itemKey = log.logId || `${log.id || 'tick'}_${idx}`;
            return (
              <div key={itemKey} className="py-2.5 px-2 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                      isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {log.name}
                  </span>

                  <span className="font-bold text-slate-900">
                    ${log.value?.toFixed(2)}
                  </span>

                  <span className={`text-[11px] font-semibold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp ? `+${log.percentChange?.toFixed(2)}%` : `${log.percentChange?.toFixed(2)}%`}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 truncate max-w-md">
                  <span className="truncate" title={log.raw}>
                    {log.raw}
                  </span>
                  <span className="shrink-0 text-slate-500 font-medium">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
