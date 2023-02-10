import { getFromStorage, setInStorage, removeFromStorage } from "./utils";

/**
 * Retrieves data from session storage. Session storage persists across page navigations and reloads but not when a tab is closed.
 * Assumes the data was originally json stringified.
 * @param key
 * @param defaultValue
 * @returns
 */
export function getFromSessionStorage<T>(key: string, defaultValue: T): T {
  return getFromStorage(window?.sessionStorage, key, defaultValue);
}

export function setInSessionStorage<T>(key: string, value: T): void {
  return setInStorage(window?.sessionStorage, key, value);
}

export function removeFromSessionStorage(key: string): void {
  return removeFromStorage(window?.sessionStorage, key);
}
