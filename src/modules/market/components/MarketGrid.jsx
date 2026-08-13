import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Activity, Wifi } from 'lucide-react';

export default function MarketGrid() {
  const indices = useSelector((state) => state.market.indices || {});
  const rowData = useMemo(() => Object.values(indices), [indices]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Exchange',
        field: 'type',
        flex: 1,
        minWidth: 100,
        cellRenderer: (params) => (
          <div className="flex items-center h-full">
            <span className="font-extrabold text-xs tracking-wider uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
              {params.value || 'NSEIDX'}
            </span>
          </div>
        ),
      },
      {
        headerName: 'Code',
        field: 'code',
        flex: 0.9,
        minWidth: 90,
        cellRenderer: (params) => (
          <span className="font-mono text-xs font-bold text-slate-600">
            {params.value || '-'}
          </span>
        ),
      },
      {
        headerName: 'Index Name',
        field: 'name',
        flex: 1.5,
        minWidth: 140,
        cellRenderer: (params) => (
          <div className="flex items-center gap-2 h-full">
            <div className="w-6 h-6 rounded bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              <Activity size={13} />
            </div>
            <span className="font-bold text-slate-900 text-sm">{params.value || 'Index'}</span>
          </div>
        ),
      },
      {
        headerName: 'Index Value',
        field: 'value',
        flex: 1.4,
        minWidth: 130,
        cellClass: 'font-extrabold text-slate-900 text-sm',
        valueFormatter: (params) =>
          params.value != null ? params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
        cellRenderer: (params) => {
          const val = params.value;
          const dir = params.data?.tickDirection;
          let colorClass = 'text-slate-900';
          if (dir === 'up') colorClass = 'text-emerald-600 animate-pulse';
          else if (dir === 'down') colorClass = 'text-rose-600 animate-pulse';

          return (
            <span className={`font-black text-sm tracking-tight ${colorClass}`}>
              {val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
            </span>
          );
        },
      },
      {
        headerName: 'Net Change',
        field: 'change',
        flex: 1.2,
        minWidth: 110,
        valueFormatter: (params) => {
          const val = Number(params.value) || 0;
          return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
        },
        cellRenderer: (params) => {
          const val = Number(params.value) || 0;
          const isPos = val >= 0;
          return (
            <div className={`flex items-center gap-1 font-bold text-xs ${isPos ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>{isPos ? `+${val.toFixed(2)}` : val.toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        headerName: '% Change',
        field: 'percentChange',
        flex: 1.2,
        minWidth: 110,
        cellRenderer: (params) => {
          const val = Number(params.value) || 0;
          const isPos = val >= 0;
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md font-extrabold text-xs ${
                isPos
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {isPos ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`}
            </span>
          );
        },
      },
      {
        headerName: 'Open',
        field: 'open',
        flex: 1.1,
        minWidth: 100,
        valueFormatter: (params) => (params.value != null ? Number(params.value).toFixed(2) : '-'),
      },
      {
        headerName: 'High',
        field: 'high',
        flex: 1.1,
        minWidth: 100,
        valueFormatter: (params) => (params.value != null ? Number(params.value).toFixed(2) : '-'),
      },
      {
        headerName: 'Low',
        field: 'low',
        flex: 1.1,
        minWidth: 100,
        valueFormatter: (params) => (params.value != null ? Number(params.value).toFixed(2) : '-'),
      },
      {
        headerName: 'Prev Close',
        field: 'close',
        flex: 1.1,
        minWidth: 100,
        valueFormatter: (params) => (params.value != null ? Number(params.value).toFixed(2) : '-'),
      },
      {
        headerName: '52W High',
        field: 'yearHigh',
        flex: 1.1,
        minWidth: 100,
        valueFormatter: (params) => (params.value != null ? Number(params.value).toFixed(2) : '-'),
      },
      {
        headerName: '52W Low',
        field: 'yearLow',
        flex: 1.1,
        minWidth: 100,
        valueFormatter: (params) => (params.value != null ? Number(params.value).toFixed(2) : '-'),
      },
      {
        headerName: 'Up / Down Moves',
        valueGetter: (params) => {
          const up = params.data.upMoves;
          const down = params.data.downMoves;
          if (up == null && down == null) return '-';
          return `${up ?? 0} / ${down ?? 0}`;
        },
        flex: 1.3,
        minWidth: 120,
        cellRenderer: (params) => (
          <span className="text-xs font-semibold text-slate-600">
            {params.value}
          </span>
        ),
      },
      {
        headerName: 'Last Updated',
        field: 'lastUpdated',
        flex: 1.4,
        minWidth: 130,
        valueFormatter: (params) => {
          if (!params.value) return '-';
          try {
            return new Date(params.value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          } catch {
            return params.value;
          }
        },
        cellRenderer: (params) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Wifi size={12} className="text-emerald-500 shrink-0 animate-pulse" />
            <span>{params.valueFormatted || params.value}</span>
          </div>
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

  return (
    <div className="ag-theme-alpine-custom w-full rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <AgGridReact
        theme="legacy"
        rowData={rowData}
        getRowId={(params) => params.data?.id || `${params.data?.type}_${params.data?.code}`}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        rowHeight={52}
        headerHeight={46}
        animateRows={true}
      />
    </div>
  );
}
