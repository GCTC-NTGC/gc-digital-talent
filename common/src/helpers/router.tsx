import { createBrowserHistory, Location } from "history";
import UniversalRouter, { Routes } from "universal-router";
import React, { useState, useEffect, useMemo, ReactElement } from "react";

const HISTORY = createBrowserHistory();

// Current implementation adapted from https://codesandbox.io/s/vyx8q7jvk7

export const useLocation = (): Location => {
  const history = HISTORY;
  const [location, setLocation] = useState<Location>(history.location);
  useEffect((): (() => void) => {
    const unListen = history.listen(({ location: newLocation }): void =>
      setLocation(newLocation),
    );
    return (): void => unListen();
  }, [history]);
  return location;
};

// Scroll to element specified in the url hash, if possible
export const useUrlHash = (): string => {
  const location = useLocation();
  const [hashFound, setHashFound] = useState(false);
  useEffect((): void => {
    if (location.hash && !hashFound) {
      const hash = location.hash.startsWith("#")
        ? location.hash.substring(1)
        : location.hash;
      const element = document.getElementById(hash);
      if (element) {
        setHashFound(true);
        window.scrollTo(0, element.offsetTop);
      }
    }
  }, [location.hash, hashFound]);
  return location.hash;
};

export const navigate = (url: string): void => {
  HISTORY.push(url);
};

export const redirect = (url: string): void => {
  HISTORY.replace(url);
};

export interface RouterResult {
  component: ReactElement;
  redirect?: string;
}

export const useRouter = (
  routes: Routes<RouterResult>,
): React.ReactElement | null => {
  const location = useLocation();
  const router = useMemo(() => new UniversalRouter(routes), [routes]);
  const [component, setComponent] = useState<React.ReactElement | null>(null);
  const path = location.pathname;
  // Render the result of routing
  useEffect((): void => {
    router.resolve(path).then(async (r) => {
      // r may or may not be a promise, so attempt to resolve it. A non-promise value will simply resolve to itself.
      const result = await Promise.resolve(r);
      if (result?.redirect) {
        redirect(result.redirect);
      } else if (result) {
        setComponent(result.component);
      }
    });
  }, [path, router]);

  return component;
};

/**
 *
 * @param imgFile The name of the img file, not including the /images/ path.
 */
export function imageUrl(baseUrl: string, imgFile: string): string {
  return `${baseUrl}/public/images/${imgFile}`;
}
