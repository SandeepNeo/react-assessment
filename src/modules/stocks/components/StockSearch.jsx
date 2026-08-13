import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, addStock } from '../store/stockSlice';
import { Search, Plus, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function StockSearch() {
  const dispatch = useDispatch();
  const { availableStocks, selectedStocks, searchTerm } = useSelector(
    (state) => state.stocks
  );
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
    setIsOpen(true);
    setErrorMsg('');
  };

  const handleClearSearch = () => {
    dispatch(setSearchTerm(''));
    setIsOpen(false);
    setErrorMsg('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const filteredStocks = availableStocks.filter((stock) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      stock.symbol.toLowerCase().includes(term) ||
      stock.name.toLowerCase().includes(term)
    );
  });

  const isStockSelected = (symbol) => {
    return selectedStocks.some(
      (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
    );
  };

  const handleSelectStock = (stock) => {
    if (isStockSelected(stock.symbol)) {
      setErrorMsg(`Stock ${stock.symbol} is already added in the table below.`);
      setTimeout(() => {
        setIsOpen(false);
        setErrorMsg('');
      }, 1200);
      return;
    }
    dispatch(addStock(stock));
    setErrorMsg('');
    dispatch(setSearchTerm(''));
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search stocks by symbol or company name (e.g. AAPL, Tesla, Reliance)..."
          className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-xs transition-all"
        />
        {searchTerm.trim().length > 0 && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto">
          {filteredStocks.length === 0 ? (
            <div className="p-4 text-center text-xs font-medium text-slate-500">
              No matching stocks found for "{searchTerm}".
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredStocks.map((stock) => {
                const alreadyAdded = isStockSelected(stock.symbol);
                return (
                  <div
                    key={stock.symbol}
                    onClick={() => handleSelectStock(stock)}
                    className={`p-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                      alreadyAdded
                        ? 'bg-slate-50/70 hover:bg-slate-100/80'
                        : 'hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {stock.symbol}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          ${stock.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {stock.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectStock(stock);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        alreadyAdded
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-2xs cursor-pointer'
                      }`}
                    >
                      {alreadyAdded ? (
                        <>
                          <CheckCircle2 size={13} /> In Table
                        </>
                      ) : (
                        <>
                          <Plus size={13} /> Add to Grid
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
