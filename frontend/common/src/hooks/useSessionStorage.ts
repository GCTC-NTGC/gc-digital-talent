import useStorage from "./useStorage";

//
/** Sync state to session storage so that it persists through a page refresh. Usage is similar to useState except we pass in a local storage key so that we can default to that value on page load instead of the specified initial value.
 * https://usehooks.com/useLocalStorage/
 * @param  {string} key
 * @param  {T} initialValue
 */
export default function useSessionStorage<T>(key: string, initialValue: T) {
  return useStorage(window?.sessionStorage, key, initialValue);
}
