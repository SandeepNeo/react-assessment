import React from 'react';
import { useSelector } from 'react-redux';
import { Wifi, Radio, Server } from 'lucide-react';

export default function ConnectionStatus() {
  const { connection } = useSelector((state) => state.market);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Nifty Socket Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
            <Radio size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Nifty Feed Socket</span>
              <span className="text-[10px] text-slate-400 font-mono">NSEIDX_26000</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <span className="capitalize">{connection.nifty}</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* Sensex Socket Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
            <Wifi size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Sensex Feed Socket</span>
              <span className="text-[10px] text-slate-400 font-mono">BSEIDX_1</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <span className="capitalize">{connection.sensex}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
        <Server size={14} className="animate-pulse text-emerald-600" />
        <span>Live Streamer Connection Active</span>
      </div>
    </div>
  );
}
