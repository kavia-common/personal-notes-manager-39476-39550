/**
 * PUBLIC_INTERFACE
 * debounce returns a debounced function that delays invoking fn until after wait ms have elapsed.
 */
export function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
