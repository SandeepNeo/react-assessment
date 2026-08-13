import React from 'react';
import { Tag } from 'lucide-react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-4 p-3.5 px-5 bg-white border border-slate-200 rounded-xl mb-6 shadow-xs">
      <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
        <Tag size={16} className="text-brand-primary" />
        <span>Categories:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
