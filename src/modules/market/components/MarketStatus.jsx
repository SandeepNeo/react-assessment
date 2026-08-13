import React from 'react';
import { useSelector } from 'react-redux';
import { Clock, ShieldAlert, CheckCircle2, Globe } from 'lucide-react';
import checkIsMarketOpen from '../utils/marketHours';

export default function MarketStatus() {
  const { isMarketOpen, marketReason } = useSelector((state) => state.market);
  const istInfo = checkIsMarketOpen();

  return (
    <div
      className={`rounded-2xl p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isMarketOpen
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-amber-50/80 border-amber-200 text-amber-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isMarketOpen
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white'
          }`}
        >
          {isMarketOpen ? <CheckCircle2 size={22} /> : <ShieldAlert size={22} />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">
              {isMarketOpen ? 'Indian Stock Exchanges Open' : 'Indian Stock Exchanges Closed'}
            </span>
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/70 border border-slate-200">
              IST (Asia/Kolkata)
            </span>
          </div>
          <p className="text-xs font-medium opacity-85 mt-0.5">{marketReason}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold self-end sm:self-auto">
        <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <Clock size={14} className="text-slate-500" />
          <span>Hours: <strong>09:15 - 15:30 IST</strong></span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <Globe size={14} className="text-brand-primary" />
          <span>Current: <strong>{istInfo.currentTimeIST}</strong></span>
        </div>
      </div>
    </div>
  );
}
