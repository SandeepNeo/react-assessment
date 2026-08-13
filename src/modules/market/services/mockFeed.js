/**
 * Generator for realistic mock pipe-delimited market feed strings.
 */
let niftyValue = 24500.50;
let sensexValue = 80350.20;

export function generateMockNiftyTick() {
  const delta = (Math.random() - 0.48) * 12.5;
  niftyValue = Math.max(20000, parseFloat((niftyValue + delta).toFixed(2)));
  const open = 24450.00;
  const high = Math.max(niftyValue, 24620.00);
  const low = Math.min(niftyValue, 24410.00);
  const close = 24420.00;
  const pctChange = parseFloat((((niftyValue - close) / close) * 100).toFixed(2));

  return `NSEIDX|Nifty50|${niftyValue.toFixed(6)}|${high.toFixed(6)}|${low.toFixed(6)}|${open.toFixed(6)}|${close.toFixed(6)}|${pctChange.toFixed(6)}|25250.000000|21200.000000|28|22|0.000000|-|1001`;
}

export function generateMockSensexTick() {
  const delta = (Math.random() - 0.48) * 45.0;
  sensexValue = Math.max(70000, parseFloat((sensexValue + delta).toFixed(2)));
  const open = 80100.00;
  const high = Math.max(sensexValue, 80750.00);
  const low = Math.min(sensexValue, 80020.00);
  const close = 80050.00;
  const pctChange = parseFloat((((sensexValue - close) / close) * 100).toFixed(2));

  return `BSEIDX|Sensex|${sensexValue.toFixed(6)}|${high.toFixed(6)}|${low.toFixed(6)}|${open.toFixed(6)}|${close.toFixed(6)}|${pctChange.toFixed(6)}|82500.000000|70100.000000|18|12|0.000000|-|2002`;
}
