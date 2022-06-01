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

export function removeFromStorage(
  store: Storage | undefined,
  key: string,
): void {
  if (store) {
    store.removeItem(key);
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
  return setInStorage(window?.localStorage, key, value);
}

export function removeFromLocalStorage(key: string): void {
  return removeFromStorage(window?.localStorage, key);
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
  return setInStorage(window?.sessionStorage, key, value);
}

export function removeFromSessionStorage(key: string): void {
  return removeFromStorage(window?.sessionStorage, key);
}
