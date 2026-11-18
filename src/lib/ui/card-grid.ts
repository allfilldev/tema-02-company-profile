export const CARD_GRID_MAX_COLUMNS = 3;

export function isFirstRowCard(index: number): boolean {
  return index >= 0 && index < CARD_GRID_MAX_COLUMNS;
}
