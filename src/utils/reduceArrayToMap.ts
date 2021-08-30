export const reduceArrayToMap = <T, K extends keyof T>(
  array: T[],
  key: K,
): Map<T[K], T> =>
  array.reduce((acc, value) => acc.set(value[key], value), new Map<T[K], T>());
