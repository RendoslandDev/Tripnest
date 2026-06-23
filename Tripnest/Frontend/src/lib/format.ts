const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Format a number as USD, e.g. 1265.77 -> "$1,265.77". */
export function formatCurrency(value: number): string {
  return usd.format(value);
}

/** Format a number as Ghana Cedi, e.g. 1200 -> "GH₵ 1,200". */
export function formatCedi(value: number): string {
  return `GH₵ ${value.toLocaleString('en-GH')}`;
}
