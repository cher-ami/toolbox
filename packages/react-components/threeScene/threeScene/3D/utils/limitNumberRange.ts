/**
 * Limit a value between a min and a max
 * @param pMin Can't go bellow
 * @param pValue Our value to limit
 * @param pMax Can't go above
 * @returns {number} Limited value
 */
export function limitNumberRange(pMin: number, pValue: number, pMax: number): number {
  return Math.max(pMin, Math.min(pValue, pMax))
}
