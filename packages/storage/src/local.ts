import {
  getFromStorage,
  setInStorage,
  removeFromStorage,
  useStorage,
} from "./utils";

/**
 * Retrieves data from local storage. Local storage persists indefinitely.
 * Assumes the data was originally json stringified.
 * @param key
 * @param defaultValue
 * @returns
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  return getFromStorage(window?.localStorage, key, defaultValue);
}

export function setInLocalStorage<T>(key: string, value: T): void {
  return setInStorage(window?.localStorage, key, value);
}

export function removeFromLocalStorage(key: string): void {
  return removeFromStorage(window?.localStorage, key);
}

/** Sync state to local storage so that it persists through a page refresh. Usage is similar to useState except we pass in a local storage key so that we can default to that value on page load instead of the specified initial value.
 * https://usehooks.com/useLocalStorage/
 * @param  {string} key
 * @param  {T} initialValue
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  return useStorage(window?.localStorage, key, initialValue);
}
