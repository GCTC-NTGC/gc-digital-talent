import { getFromStorage, setInStorage, removeFromStorage } from "./utils";

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
