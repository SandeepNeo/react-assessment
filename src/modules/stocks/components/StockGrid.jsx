import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { updateStock, deleteStock } from '../store/stockSlice';
import { Trash2 } from 'lucide-react';
import ConfirmModal from '../../../components/common/ConfirmModal';

const parseCleanNumber = (val) => {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string' || !val.trim()) return NaN;
  const cleaned = val.replace(/[\$,\+\s]/g, '');
  return parseFloat(cleaned);
};

export default function StockGrid({ selectedStocks }) {
  const dispatch = useDispatch();
  const [stockToDelete, setStockToDelete] = useState(null);

  const handleCellValueChanged = (params) => {
    const { field } = params.colDef;
    const { symbol } = params.data;
    const newValue = params.newValue;
    const oldValue = params.oldValue;

    if (newValue === oldValue) return;

    if (field === 'price' || field === 'low' || field === 'high' || field === 'volume') {
      const numVal = parseCleanNumber(newValue);
      if (isNaN(numVal) || ((field === 'price' || field === 'volume' || field === 'low' || field === 'high') && numVal < 0)) {
        alert(`Invalid entry for ${params.colDef.headerName}. Must be a valid non-negative number.`);
        params.node.setDataValue(field, oldValue);
        return;
      }
      dispatch(updateStock({ symbol, field, value: numVal }));
    } else if (field === 'change') {
      const numVal = parseCleanNumber(newValue);
      if (isNaN(numVal)) {
        alert('Invalid entry for Change. Must be a valid number.');
        params.node.setDataValue(field, oldValue);
        return;
      }
      dispatch(updateStock({ symbol, field, value: numVal }));
    } else {
      const strVal = String(newValue ?? '').trim();
      dispatch(updateStock({ symbol, field, value: strVal }));
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Symbol',
        field: 'symbol',
        editable: false,
        flex: 1.1,
        minWidth: 100,
        cellRenderer: (params) => (
          <div className="flex items-center h-full">
            <span className="font-extrabold text-slate-900 text-sm tracking-wide bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {params.value}
            </span>
          </div>
        ),
      },
      {
        headerName: 'Company Name',
        field: 'name',
        editable: false,
        flex: 2,
        minWidth: 160,
        cellRenderer: (params) => (
          <span className="font-semibold text-slate-800 text-sm truncate">{params.value}</span>
        ),
      },
      {
        headerName: 'Price ($)',
        field: 'price',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 1.2,
        minWidth: 110,
        cellClass: 'editable-cell font-bold text-slate-900 cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => (params.value != null ? `$${Number(params.value).toFixed(2)}` : '-'),
      },
      {
        headerName: 'Change ($)',
        field: 'change',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 1.2,
        minWidth: 110,
        cellClass: 'editable-cell font-bold cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => {
          const val = Number(params.value) || 0;
          return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
        },
        cellStyle: (params) => {
          const val = Number(params.value) || 0;
          return {
            color: val >= 0 ? '#047857' : '#be123c',
            fontWeight: '700',
          };
        },
      },
      {
        headerName: 'Low ($)',
        field: 'low',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 1,
        minWidth: 100,
        cellClass: 'editable-cell text-slate-600 font-medium cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => (params.value != null ? `$${Number(params.value).toFixed(2)}` : '-'),
      },
      {
        headerName: 'High ($)',
        field: 'high',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 1,
        minWidth: 100,
        cellClass: 'editable-cell text-slate-600 font-medium cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => (params.value != null ? `$${Number(params.value).toFixed(2)}` : '-'),
      },
      {
        headerName: 'Volume',
        field: 'volume',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 1.3,
        minWidth: 120,
        cellClass: 'editable-cell text-slate-700 font-medium cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) =>
          params.value != null ? Number(params.value).toLocaleString() : '-',
      },
      {
        headerName: 'Market Cap',
        field: 'marketCap',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 1.2,
        minWidth: 110,
        cellClass: 'editable-cell font-semibold text-slate-700 cursor-pointer hover:bg-blue-50/70',
      },
      {
        headerName: 'Updated At',
        field: 'updateDateTime',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 1.5,
        minWidth: 140,
        cellClass: 'editable-cell text-slate-600 text-xs font-medium cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => {
          if (!params.value) return '-';
          try {
            return new Date(params.value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          } catch (e) {
            return params.value;
          }
        },
      },
      {
        headerName: 'Action',
        editable: false,
        flex: 0.9,
        minWidth: 90,
        cellClass: 'flex items-center justify-center',
        cellRenderer: (params) => (
          <button
            onClick={() => setStockToDelete(params.data.symbol)}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Delete stock entry"
          >
            <Trash2 size={14} />
            <span className="hidden xl:inline">Delete</span>
          </button>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: false,
    }),
    []
  );

  const rowData = useMemo(() => selectedStocks.map((s) => ({ ...s })), [selectedStocks]);

  return (
    <>
      <div className="ag-theme-alpine-custom w-full rounded-xl border border-slate-200 bg-white shadow-xs">
        <AgGridReact
          theme="legacy"
          rowData={rowData}
          getRowId={(params) => params.data?.symbol || params.data?.id || 'stock-row'}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={handleCellValueChanged}
          domLayout="autoHeight"
          singleClickEdit={true}
          stopEditingWhenCellsLoseFocus={true}
          rowHeight={52}
          headerHeight={46}
          animateRows={true}
        />
      </div>

      <ConfirmModal
        isOpen={!!stockToDelete}
        title="Delete Stock"
        message="Are you sure you want to delete?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (stockToDelete) {
            dispatch(deleteStock(stockToDelete));
          }
        }}
        onClose={() => setStockToDelete(null)}
      />
    </>
  );
}
