/**
 * Parses pipe-delimited market feed strings into a structured JS object.
 * Sample feed string:
 * NSEIDX|Nifty50|18382.550000|18384.950000|18294.250000|18326.100000|18267.250000|0.630000|18442.150000|15183.400000|2533.720000|2502.450000|0.000000|-|7207
 */
export function parseMarketMessage(rawMessage) {
  if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
    return null;
  }

  const parts = rawMessage.trim().split('|');

  // Must have at least 8 essential fields to construct index update
  if (parts.length < 8) {
    return null;
  }

  const type = parts[0];
  const name = parts[1];
  const value = parseFloat(parts[2]);
  const high = parseFloat(parts[3]);
  const low = parseFloat(parts[4]);
  const open = parseFloat(parts[5]);
  const close = parseFloat(parts[6]);
  const percentChange = parseFloat(parts[7]);
  const yearHigh = parts[8] ? parseFloat(parts[8]) : null;
  const yearLow = parts[9] ? parseFloat(parts[9]) : null;

  if (isNaN(value) || isNaN(percentChange)) {
    return null;
  }

  return {
    raw: rawMessage,
    type,
    name,
    value,
    high: isNaN(high) ? null : high,
    low: isNaN(low) ? null : low,
    open: isNaN(open) ? null : open,
    close: isNaN(close) ? null : close,
    percentChange,
    yearHigh: isNaN(yearHigh) ? null : yearHigh,
    yearLow: isNaN(yearLow) ? null : yearLow,
    timestamp: new Date().toISOString(),
  };
}

export default parseMarketMessage;
