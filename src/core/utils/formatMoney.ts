/**
 * "1,234.56 GBP" — hand-rolled instead of toLocaleString because Hermes Intl
 * coverage differs across platforms and the app needs one stable rendering.
 */
export function formatMoney(value: number, currency: string): string {
  const [whole, fraction] = value.toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${grouped}.${fraction} ${currency}`;
}
