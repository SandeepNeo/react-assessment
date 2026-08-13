import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/cartSlice';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartGrid({ cartItems }) {
  const dispatch = useDispatch();

  const handleCellValueChanged = (params) => {
    if (params.colDef.field === 'quantity') {
      const newQty = parseInt(params.newValue, 10);
      if (isNaN(newQty) || newQty < 1) {
        params.node.setDataValue('quantity', params.oldValue);
        alert('Quantity must be a positive integer greater than or equal to 1.');
        return;
      }
      dispatch(updateQuantity({ id: params.data.id, quantity: newQty }));
    }
  };

  const handleQuantityIncrement = (data) => {
    dispatch(updateQuantity({ id: data.id, quantity: data.quantity + 1 }));
  };

  const handleQuantityDecrement = (data) => {
    if (data.quantity > 1) {
      dispatch(updateQuantity({ id: data.id, quantity: data.quantity - 1 }));
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Product',
        field: 'name',
        flex: 2.2,
        minWidth: 240,
        cellRenderer: (params) => (
          <div className="flex items-center gap-3.5 h-full py-1">
            <img
              src={params.data.image}
              alt={params.value}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
            />
            <div className="flex flex-col justify-center leading-tight min-w-0">
              <span className="font-bold text-slate-900 text-sm truncate">{params.value}</span>
              <span className="text-[11px] text-slate-500 font-medium capitalize">{params.data.category}</span>
            </div>
          </div>
        ),
      },
      {
        headerName: 'Unit Price',
        field: 'price',
        flex: 1,
        minWidth: 110,
        cellClass: 'flex items-center',
        valueFormatter: (params) => `$${Number(params.value).toFixed(2)}`,
        cellRenderer: (params) => (
          <span className="font-semibold text-slate-700 text-sm">${Number(params.value).toFixed(2)}</span>
        ),
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        editable: true,
        flex: 1.5,
        minWidth: 150,
        cellClass: 'editable-cell flex items-center justify-center',
        cellRenderer: (params) => (
          <div className="flex items-center justify-between w-full bg-slate-100/80 border border-slate-200 rounded-lg px-2 py-1">
            <button
              onClick={() => handleQuantityDecrement(params.data)}
              disabled={params.value <= 1}
              className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
              title="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <span className="font-bold text-slate-900 text-xs px-2" title="Double click to edit directly">
              {params.value}
            </span>
            <button
              onClick={() => handleQuantityIncrement(params.data)}
              className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors shadow-2xs"
              title="Increase quantity"
            >
              <Plus size={11} />
            </button>
          </div>
        ),
      },
      {
        headerName: 'Total Price',
        valueGetter: (params) => (params.data.price || 0) * (params.data.quantity || 0),
        flex: 1.2,
        minWidth: 130,
        cellClass: 'flex items-center',
        cellRenderer: (params) => (
          <span className="font-extrabold text-emerald-600 text-sm">
            ${Number(params.value).toFixed(2)}
          </span>
        ),
      },
      {
        headerName: 'Action',
        flex: 0.9,
        minWidth: 100,
        cellClass: 'flex items-center justify-center',
        cellRenderer: (params) => (
          <button
            onClick={() => dispatch(removeFromCart(params.data.id))}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Remove item from cart"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        ),
      },
    ],
    [dispatch]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: false,
    }),
    []
  );

  return (
    <div className="ag-theme-alpine-custom h-[420px] w-full rounded-xl shadow-xs overflow-hidden border border-slate-200 bg-white">
      <AgGridReact
        rowData={cartItems}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={handleCellValueChanged}
        rowHeight={60}
        headerHeight={46}
        animateRows={true}
      />
    </div>
  );
}
