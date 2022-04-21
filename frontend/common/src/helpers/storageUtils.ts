export function getFromStorage<T>(
  store: Storage | undefined,
  key: string,
  defaultValue: T,
): T {
  // TODO: Is it worth allowing store to be undefined? And why catch and hide errors here?
  if (store === undefined) {
    return defaultValue;
  }
  try {
    // Get from local storage by key
    const item = store.getItem(key);
    // Parse stored json or if none return defaultValue
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // If error also return defaultValue
    // console.log(error);
    return defaultValue;
  }
}

export function setInStorage<T>(
  store: Storage | undefined,
  key: string,
  value: T,
): void {
  if (store) {
    store.setItem(key, JSON.stringify(value));
  }
}

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
  setInStorage(window?.localStorage, key, value);
}

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
  setInStorage(window?.sessionStorage, key, value);
}
