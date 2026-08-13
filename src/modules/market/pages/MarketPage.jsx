import React from 'react';
import { useSelector } from 'react-redux';
import { useMarketWebSocket } from '../hooks/useMarketWebSocket';
import MarketStatus from '../components/MarketStatus';
import ConnectionStatus from '../components/ConnectionStatus';
import IndexCard from '../components/IndexCard';
import TickLog from '../components/TickLog';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';

export default function MarketPage() {
  // Activate WebSocket listener custom hook
  useMarketWebSocket();

  const { nifty50, sensex, connection } = useSelector((state) => state.market);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Real-Time Market Dashboard
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Live stream of Nifty 50 and Sensex benchmarks with pipe-delimited feed parser & IST schedule tracking.
          </p>
        </div>
      </div>

      {/* Market IST Status Banner */}
      <MarketStatus />

      {/* Socket Connection & Mock Feed Controls */}
      <ConnectionStatus />

      {/* Benchmark Index Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndexCard
          data={nifty50}
          connectionStatus={connection.nifty}
          symbolCode="NSEIDX_26000"
        />
        <IndexCard
          data={sensex}
          connectionStatus={connection.sensex}
          symbolCode="BSEIDX_1"
        />
      </div>

      {/* Real-time Tick Activity Feed */}
      <TickLog />
    </div>
  );
}
