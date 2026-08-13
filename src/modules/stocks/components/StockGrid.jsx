import React, { useMemo, useState, useRef, useEffect } from 'react';
import { AgGridReact, useGridCellEditor } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { updateStock, deleteStock } from '../store/stockSlice';
import { Trash2 } from 'lucide-react';

// AG Grid v36 React Cell Editor using useGridCellEditor hook with dynamic ref tracking
const StockCellEditor = (props) => {
  const [value, setValue] = useState(props.value ?? '');
  const valueRef = useRef(value);
  valueRef.current = value;
  const inputRef = useRef(null);

  useGridCellEditor({
    getValue() {
      return valueRef.current;
    },
    isCancelAfterEnd() {
      return false;
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 15);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    valueRef.current = val;
    if (props.onValueChange) {
      props.onValueChange(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (props.stopEditing) {
        props.stopEditing();
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center p-0.5 bg-white">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-2.5 py-1 bg-white text-slate-900 border-2 border-brand-primary rounded-lg outline-none font-bold text-xs shadow-xs"
      />
    </div>
  );
};

const parseCleanNumber = (val) => {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string' || !val.trim()) return NaN;
  const cleaned = val.replace(/[\$,\+\s]/g, '');
  return parseFloat(cleaned);
};

export default function StockGrid({ selectedStocks }) {
  const dispatch = useDispatch();

  const handleCellValueChanged = (params) => {
    const { field } = params.colDef;
    const { symbol } = params.data;
    const newValue = params.newValue;
    const oldValue = params.oldValue;

    if (field === 'price' || field === 'low' || field === 'high' || field === 'volume') {
      const numVal = parseCleanNumber(newValue);
      if (isNaN(numVal) || ((field === 'price' || field === 'volume') && numVal < 0)) {
        params.node.setDataValue(field, oldValue);
        alert(`Invalid entry for ${field}. Value must be a valid non-negative number.`);
        return;
      }
      dispatch(updateStock({ symbol, field, value: numVal }));
    } else if (field === 'change') {
      const numVal = parseCleanNumber(newValue);
      if (isNaN(numVal)) {
        params.node.setDataValue(field, oldValue);
        alert('Invalid entry for Change. Value must be a valid number.');
        return;
      }
      dispatch(updateStock({ symbol, field, value: numVal }));
    } else {
      dispatch(updateStock({ symbol, field, value: String(newValue) }));
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
        cellEditor: StockCellEditor,
        useValueFormatterForEdit: false,
        flex: 1.2,
        minWidth: 110,
        cellClass: 'editable-cell font-bold text-slate-900 cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => (params.value != null ? `$${Number(params.value).toFixed(2)}` : '-'),
      },
      {
        headerName: 'Change ($)',
        field: 'change',
        editable: true,
        cellEditor: StockCellEditor,
        useValueFormatterForEdit: false,
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
        cellEditor: StockCellEditor,
        useValueFormatterForEdit: false,
        flex: 1,
        minWidth: 100,
        cellClass: 'editable-cell text-slate-600 font-medium cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => (params.value != null ? `$${Number(params.value).toFixed(2)}` : '-'),
      },
      {
        headerName: 'High ($)',
        field: 'high',
        editable: true,
        cellEditor: StockCellEditor,
        useValueFormatterForEdit: false,
        flex: 1,
        minWidth: 100,
        cellClass: 'editable-cell text-slate-600 font-medium cursor-pointer hover:bg-blue-50/70',
        valueFormatter: (params) => (params.value != null ? `$${Number(params.value).toFixed(2)}` : '-'),
      },
      {
        headerName: 'Volume',
        field: 'volume',
        editable: true,
        cellEditor: StockCellEditor,
        useValueFormatterForEdit: false,
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
        cellEditor: StockCellEditor,
        flex: 1.2,
        minWidth: 110,
        cellClass: 'editable-cell font-semibold text-slate-700 cursor-pointer hover:bg-blue-50/70',
      },
      {
        headerName: 'Updated At',
        field: 'updateDateTime',
        editable: true,
        cellEditor: StockCellEditor,
        useValueFormatterForEdit: false,
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
            onClick={() => dispatch(deleteStock(params.data.symbol))}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Delete stock entry"
          >
            <Trash2 size={14} />
            <span className="hidden xl:inline">Delete</span>
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
    <div className="ag-theme-alpine-custom w-full rounded-xl border border-slate-200 bg-white shadow-xs">
      <AgGridReact
        rowData={selectedStocks}
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
  );
}
