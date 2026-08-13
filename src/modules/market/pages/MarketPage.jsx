import { useMarketWebSocket } from '../hooks/useMarketWebSocket';
import ConnectionStatus from '../components/ConnectionStatus';
import MarketGrid from '../components/MarketGrid';
import TickLog from '../components/TickLog';
import { Activity } from 'lucide-react';

export default function MarketPage() {
  // Activate WebSocket listener custom hook
  useMarketWebSocket();

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
            Live stream of Nifty 50, Sensex and market benchmarks parsed directly from pipe-delimited WebSocket feeds into AG Grid.
          </p>
        </div>
      </div>

      {/* Socket Connection & Mock Feed Controls */}
      <ConnectionStatus />

      {/* Real-Time Market AG Grid Table */}
      <MarketGrid />

      {/* Real-time Tick Activity Feed */}
      <TickLog />
    </div>
  );
}
