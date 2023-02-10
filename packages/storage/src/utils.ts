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
