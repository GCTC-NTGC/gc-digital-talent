import {
  getFromStorage,
  setInStorage,
  removeFromStorage,
  useStorage,
} from "./utils";

/**
 * Retrieves data from session storage. Session storage persists across page navigations and reloads but not when a tab is closed.
 * Assumes the data was originally json stringified.
 * @param key
 * @param defaultValue
 * @returns
 */
export function getFromSessionStorage<T>(key: string, defaultValue: T): T {
  return getFromStorage(window.sessionStorage, key, defaultValue);
}

export function setInSessionStorage<T>(key: string, value: T): void {
  return setInStorage(window.sessionStorage, key, value);
}

export function removeFromSessionStorage(key: string): void {
  return removeFromStorage(window.sessionStorage, key);
}

/** Sync state to session storage so that it persists through a page refresh. Usage is similar to useState except we pass in a local storage key so that we can default to that value on page load instead of the specified initial value.
 * https://usehooks.com/useLocalStorage/
 * @param  {string} key
 * @param  {T} initialValue
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  return useStorage(window.sessionStorage, key, initialValue);
}
