import { ComponentType } from "react";
import { getFromLocalStorage, setInLocalStorage } from "./storageUtils";

/**
 * Lazy with Retry
 *
 * This forces a refresh when a chunk
 * is not loaded properly in order to get
 * the latest un-cached version
 *
 * Helps to prevent ChunkLoadError
 *
 * REF: https://www.codemzy.com/blog/fix-chunkloaderror-react
 *
 * @param componentImport () => Promise<{default: T}> The component being imported
 * @param name  string    Name the component (only needed when using multiple components on same page)
 * @returns
 */
const lazyRetry = <T extends ComponentType<unknown>>(
  componentImport: () => Promise<{ default: T }>,
  name?: string,
): Promise<{ default: T }> => {
  return new Promise((resolve, reject) => {
    const storageKey = name
      ? `component-${name}-refreshed`
      : `component-refreshed`;
    /**
     * Track if the page has already refresh to prevent loop
     * in the case that the file actually does not exist
     */
    const hasRefreshed = JSON.parse(getFromLocalStorage(storageKey, "false"));

    /**
     * Attempt to load the component
     */
    componentImport()
      .then((component) => {
        // Success so unset refresh and resolve component
        setInLocalStorage(storageKey, "false");
        resolve(component);
      })
      .catch((error: Error) => {
        if (!hasRefreshed) {
          /**
           * Could not load chunk so refresh the page
           * and store it so we don't keep refreshing
           */
          setInLocalStorage(storageKey, "true");
          return window.location.reload();
        }
        return reject(error);
      });
  });
};

export default lazyRetry;
