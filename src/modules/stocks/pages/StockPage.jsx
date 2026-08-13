import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import stockService from '../services/stockService';
import { setAvailableStocks, addStock } from '../store/stockSlice';
import StockSearch from '../components/StockSearch';
import StockToolbar from '../components/StockToolbar';
import StockGrid from '../components/StockGrid';
import { LineChart, PlusCircle, Info } from 'lucide-react';

export default function StockPage() {
  const dispatch = useDispatch();
  const { availableStocks, selectedStocks } = useSelector((state) => state.stocks);

  useEffect(() => {
    stockService.getAvailableStocks().then((data) => {
      dispatch(setAvailableStocks(data));
    });
  }, [dispatch]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <LineChart size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Portfolio Manager</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Search stocks, add to AG Grid table, edit values in real-time, and manage your watchlist.
          </p>
        </div>

        <StockSearch />
      </div>

      {/* Info callout */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-3">
        <Info size={18} className="text-brand-primary shrink-0 mt-0.5" />
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-semibold">Interactive AG Grid Editing:</strong> Single-click any data cell (Price, Change, Low, High, Volume, Market Cap, Updated At) to edit values inline. Cell edits update Redux instantly; invalid inputs are safely validated and reverted.
        </p>
      </div>



      {/* Stats & Controls Toolbar */}
      <StockToolbar />

      {/* AG Grid Table Container */}
      {selectedStocks.length > 0 ? (
        <StockGrid selectedStocks={selectedStocks} />
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <PlusCircle size={28} />
          </div>
          <div className="max-w-md">
            <h3 className="text-base font-bold text-slate-900">No stocks currently added</h3>
            <p className="text-xs text-slate-500 mt-1">
              Use the search bar above to search for stocks like AAPL, GOOGL, TSLA or click "Add All Samples" in the toolbar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
