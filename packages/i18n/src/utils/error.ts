/**
 * Checks if an object has an attribute with a particular key
 * @param object
 * @param key
 */
export function hasKey<T>(
  object: { [key: string]: T },
  key: string | number,
): boolean {
  return object[key] !== undefined;
}

/**
 * Returns the value at the specified key. If the key is not present, throws an error.
 * @param object
 * @param key
 * @param errorMessage
 */
function getOrThrowError<T>(
  object: { [key: string]: T },
  key: string | number,
  errorMessage: string,
): T {
  if (!hasKey(object, key)) {
    throw new Error(errorMessage);
  }
  return object[key];
}

export default getOrThrowError;
