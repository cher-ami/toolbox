/**
 * Format className string 
 * @param rest
 */
export function mergeClass(...rest: string[]): string {
  if (rest?.length === 0) return
  return rest
    .reduce((a, b) => a.concat(b), [])
    .filter((v) => v)
    .join(" ")
}
