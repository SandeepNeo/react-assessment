import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMockFeed } from '../store/marketSlice';
import { Wifi, Radio, Sliders, Server } from 'lucide-react';

export default function ConnectionStatus() {
  const dispatch = useDispatch();
  const { connection, useMockFeed } = useSelector((state) => state.market);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Nifty Socket Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
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
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
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

      {/* Mock Feed Toggle Switch */}
      <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
        <Sliders size={16} className="text-brand-primary shrink-0" />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-bold text-slate-900">Development Mock Feed</span>
          <span className="text-[10px] text-slate-500">
            {useMockFeed ? 'Simulating real-time WebSocket ticks' : 'Connecting to live streamer'}
          </span>
        </div>
        <button
          onClick={() => dispatch(toggleMockFeed())}
          className={`ml-2 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            useMockFeed ? 'bg-brand-primary' : 'bg-slate-300'
          }`}
          role="switch"
          aria-checked={useMockFeed}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              useMockFeed ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
