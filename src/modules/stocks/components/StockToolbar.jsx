import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStock, deleteStock } from '../store/stockSlice';
import { TrendingUp, TrendingDown, Layers, Sparkles, Trash2 } from 'lucide-react';

export default function StockToolbar() {
  const dispatch = useDispatch();
  const { availableStocks, selectedStocks } = useSelector((state) => state.stocks);

  const gainers = selectedStocks.filter((s) => s.change >= 0).length;
  const losers = selectedStocks.filter((s) => s.change < 0).length;
  const totalValue = selectedStocks.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const handleAddAll = () => {
    availableStocks.forEach((stock) => {
      dispatch(addStock(stock));
    });
  };

  const handleClearAll = () => {
    selectedStocks.forEach((stock) => {
      dispatch(deleteStock(stock.symbol));
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center border border-blue-100 shadow-2xs">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              Tracked Stocks
            </span>
            <span className="text-lg font-bold text-slate-900 leading-none">
              {selectedStocks.length} <span className="text-xs text-slate-400 font-medium">rows</span>
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div>
          <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
            Total Aggregate Price
          </span>
          <span className="text-lg font-bold text-slate-900 leading-none">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            <TrendingUp size={14} /> {gainers} Gainers
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
            <TrendingDown size={14} /> {losers} Losers
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleAddAll}
          className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Add all sample stocks to grid"
        >
          <Sparkles size={14} className="text-brand-primary" /> Add All Samples
        </button>
        {selectedStocks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Clear grid"
          >
            <Trash2 size={14} /> Clear Grid
          </button>
        )}
      </div>
    </div>
  );
}
