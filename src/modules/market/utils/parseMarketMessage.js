/**
 * Parses pipe-delimited market feed strings into a structured JS object.
 *
 * Real WebSocket Feed Examples:
 * BSEIDX|1|77855.31|78119.39|77665.89|78111.91|77966.35||||||||1786611846099|2011
 * NSEIDX|26000|24361.700000|24431.600000|24311.400000|24431.600000|24435.950000|42949672.660000|26373.200000|22182.550000|4869.030000|5019.620000|0.000000|+|1786611846137|7207
 * NSEIDX|26009|57597.000000|57799.150000|57548.600000|57799.150000|57885.850000|42949672.460000|61764.850000|49954.850000|1171.290000|1179.230000|0.000000| |1786611846343|7207
 *
 * Field Indices:
 * 0: Type (NSEIDX, BSEIDX)
 * 1: Index Code / Name (1, 26000, 26009, Nifty50, Sensex)
 * 2: Index Value (Last Traded Price)
 * 3: High
 * 4: Low
 * 5: Open
 * 6: Close
 * 7: Percent Change
 * 8: Year High (52W High)
 * 9: Year Low (52W Low)
 * 10: Up Moves
 * 11: Down Moves
 * 12: Market Cap
 * 13: Net Change Indicator (+ / - / blank)
 * 14: Timestamp (epoch ms or datetime)
 * 15: Transaction Code
 */

const INDEX_NAME_MAP = {
  '1': 'Sensex',
  '26000': 'Nifty 50',
  '26009': 'Nifty Bank',
  'Nifty50': 'Nifty 50',
  'Sensex': 'Sensex',
};

export function parseMarketMessage(rawMessage) {
  if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
    return null;
  }

  const parts = rawMessage.trim().split('|');

  if (parts.length < 3) {
    return null;
  }

  const type = parts[0] ? parts[0].trim() : 'NSEIDX';
  let rawCode = parts[1] ? parts[1].trim() : '';
  if (rawCode === 'Nifty50') rawCode = '26000';
  if (rawCode === 'Sensex') rawCode = '1';

  const name = INDEX_NAME_MAP[rawCode] || rawCode || 'Index';

  const value = parseFloat(parts[2]);
  if (isNaN(value)) {
    return null;
  }

  const high = parts[3] ? parseFloat(parts[3]) : null;
  const low = parts[4] ? parseFloat(parts[4]) : null;
  const open = parts[5] ? parseFloat(parts[5]) : null;
  const close = parts[6] ? parseFloat(parts[6]) : null;

  let rawPct = parts[7] ? parseFloat(parts[7]) : NaN;
  let change = 0;
  let percentChange = 0;

  // Calculate actual change and percent change if close price is available
  if (close && !isNaN(close) && close > 0) {
    change = value - close;
    percentChange = (change / close) * 100;
  } else if (!isNaN(rawPct) && Math.abs(rawPct) < 1000) {
    percentChange = rawPct;
    change = (value * percentChange) / 100;
  }

  const yearHigh = parts[8] ? parseFloat(parts[8]) : null;
  const yearLow = parts[9] ? parseFloat(parts[9]) : null;
  const upMoves = parts[10] ? parseFloat(parts[10]) : null;
  const downMoves = parts[11] ? parseFloat(parts[11]) : null;
  const marketCap = parts[12] ? parts[12].trim() : '-';
  const indicator = parts[13] ? parts[13].trim() : '';
  const txnCode = parts[15] ? parts[15].trim() : '';

  let timestamp = new Date().toISOString();
  if (parts[14]) {
    const epochMs = parseInt(parts[14], 10);
    if (!isNaN(epochMs) && epochMs > 1000000000000) {
      timestamp = new Date(epochMs).toISOString();
    }
  }

  return {
    raw: rawMessage,
    id: `${type}_${rawCode}`,
    type,
    code: rawCode,
    name,
    value,
    change,
    percentChange,
    high: isNaN(high) ? null : high,
    low: isNaN(low) ? null : low,
    open: isNaN(open) ? null : open,
    close: isNaN(close) ? null : close,
    yearHigh: isNaN(yearHigh) ? null : yearHigh,
    yearLow: isNaN(yearLow) ? null : yearLow,
    upMoves: isNaN(upMoves) ? null : upMoves,
    downMoves: isNaN(downMoves) ? null : downMoves,
    marketCap,
    indicator,
    txnCode,
    timestamp,
  };
}

export default parseMarketMessage;
