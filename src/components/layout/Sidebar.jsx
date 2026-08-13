import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, LineChart, Activity, Layers } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    {
      title: 'Task 1 — E-Commerce',
      items: [
        { path: '/ecommerce', label: 'Products Catalog', icon: ShoppingBag, end: true },
      ],
    },
    {
      title: 'Task 2 — Stocks',
      items: [
        { path: '/stocks', label: 'Stock Manager', icon: LineChart, end: false },
      ],
    },
    {
      title: 'Task 3 — Market Feed',
      items: [
        { path: '/market', label: 'Nifty 50 & Sensex', icon: Activity, end: false },
      ],
    },
  ];


  return (
    <aside className="w-[250px] bg-slate-50 border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="h-[70px] flex items-center gap-3 px-5 border-b border-slate-200">
        <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center shadow-xs">
          <Layers size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-slate-900 tracking-tight">React Evaluation</span>
          <span className="text-[11px] text-slate-500">Assessment Suite</span>
        </div>
      </div>

      <nav className="flex-1 p-5 overflow-y-auto flex flex-col gap-6">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2">
              {group.title}
            </span>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-primary text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`
                    }
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
