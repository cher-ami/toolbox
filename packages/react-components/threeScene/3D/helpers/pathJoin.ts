/**
 * Joins all given path segments together
 * @param {...string} args String parts
 * @returns {string}
 */
export default function pathJoin(...args: string[]): string {
  return args
    .map((part, i) => {
      if (i === 0) {
        return part.trim().replace(/[\/]*$/g, "")
      } else {
        return part.trim().replace(/(^[\/]*|[\/]*$)/g, "")
      }
    })
    .filter((x) => x.length)
    .join("/")
}
