export function formatGold(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}
