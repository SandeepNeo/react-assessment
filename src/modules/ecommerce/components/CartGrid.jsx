import { useMemo, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/cartSlice';
import { Trash2, Plus, Minus } from 'lucide-react';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function CartGrid({ cartItems }) {
  const dispatch = useDispatch();
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleQuantityIncrement = useCallback(
    (data) => {
      dispatch(updateQuantity({ id: data.id, quantity: data.quantity + 1 }));
    },
    [dispatch]
  );

  const handleQuantityDecrement = useCallback(
    (data) => {
      if (data.quantity > 1) {
        dispatch(updateQuantity({ id: data.id, quantity: data.quantity - 1 }));
      }
    },
    [dispatch]
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Product',
        field: 'name',
        editable: false,
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
        editable: false,
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
        editable: false,
        flex: 1.5,
        minWidth: 150,
        cellClass: 'flex items-center justify-center',
        cellRenderer: (params) => (
          <div className="flex items-center justify-between w-full max-w-[120px] bg-slate-100/80 border border-slate-200 rounded-lg px-2 py-1">
            <button
              onClick={() => handleQuantityDecrement(params.data)}
              disabled={params.value <= 1}
              className="w-6 h-6 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs shrink-0"
              title="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="font-bold text-slate-900 text-sm px-2 select-none">
              {params.value}
            </span>
            <button
              onClick={() => handleQuantityIncrement(params.data)}
              className="w-6 h-6 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors shadow-2xs shrink-0"
              title="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
        ),
      },
      {
        headerName: 'Total Price',
        editable: false,
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
        editable: false,
        flex: 0.9,
        minWidth: 100,
        cellClass: 'flex items-center justify-center',
        cellRenderer: (params) => (
          <button
            onClick={() => setItemToDelete(params.data.id)}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Remove item from cart"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        ),
      },
    ],
    [handleQuantityDecrement, handleQuantityIncrement]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: false,
    }),
    []
  );

  const rowData = useMemo(() => cartItems.map((item) => ({ ...item })), [cartItems]);

  return (
    <>
      <div className="ag-theme-alpine-custom h-[420px] w-full rounded-xl shadow-xs overflow-hidden border border-slate-200 bg-white">
        <AgGridReact
          theme="legacy"
          rowData={rowData}
          getRowId={(params) => String(params.data?.id ?? 'cart-row')}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={60}
          headerHeight={46}
          animateRows={true}
        />
      </div>

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Remove Item"
        message="Are you sure you want to delete?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (itemToDelete) {
            dispatch(removeFromCart(itemToDelete));
            setItemToDelete(null);
          }
        }}
        onClose={() => setItemToDelete(null)}
      />
    </>
  );
}
