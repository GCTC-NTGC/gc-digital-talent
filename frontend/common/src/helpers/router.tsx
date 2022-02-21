import { createBrowserHistory, Location, Path, State } from "history";
import UniversalRouter, { Routes } from "universal-router";
import React, { useState, useEffect, useMemo, ReactElement } from "react";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import path from "path-browserify";

export const HISTORY = createBrowserHistory();

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

export const useUrlQuery = (): Location => {
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

/**
 * Change the browser url, without a full page refresh. Client-side routing will process the new url.
 * The current url is added to the history stack, and can be returned to by navigating Back.
 * @param url
 */
export const navigate = (url: string | Partial<Path>): void => {
  HISTORY.push(url);
};

/**
 * Like the navigate function, except the current url is not added to the history stack.
 * @param url
 */
export const redirect = (url: string | Partial<Path>): void => {
  HISTORY.replace(url);
};

export const clearQueryParams = (): void => {
  if (!HISTORY.location.search) {
    return;
  }
  HISTORY.replace({
    search: "",
  });
};

export const navigateBack = (): void => {
  HISTORY.back();
};

export const pushToStateThenNavigate = (url: string, state: State): void => {
  HISTORY.push(url, { some: state });
};

export interface RouterResult {
  component: ReactElement;
  redirect?: string;
}

export const useRouter = (
  routes: Routes<RouterResult>,
  missingRouteComponent: ReactElement,
): React.ReactElement | null => {
  const location = useLocation();
  const router = useMemo(() => new UniversalRouter(routes), [routes]);
  const [component, setComponent] = useState<React.ReactElement | null>(null);
  const pathName = location.pathname;
  // Render the result of routing
  useEffect((): void => {
    router
      .resolve(pathName)
      .then(async (r) => {
        // r may or may not be a promise, so attempt to resolve it. A non-promise value will simply resolve to itself.
        const result = await Promise.resolve(r);
        if (result?.redirect) {
          redirect(result.redirect);
        } else if (result) {
          setComponent(result.component);
        }
      })
      .catch(async () => {
        setComponent(missingRouteComponent);
      });
  }, [pathName, router, missingRouteComponent]);

  return component;
};

/**
 *
 * @param imgFile The name of the img file, not including the /images/ path.
 */
export function imageUrl(baseUrl: string, imgFile: string): string {
  return path.join(baseUrl, "/public/images/", imgFile);
}

export function parseUrlQueryParameters(
  location: Location,
): Record<string, string> {
  const queryString = location.search.startsWith("?")
    ? location.search.substring(1)
    : location.search;
  const stringPairs = queryString
    .split("&")
    .map((pair) => pair.split("=").map(decodeURIComponent));
  return fromPairs(stringPairs);
}

export function queryParametersToSearchString(
  queryParams: Record<string, string>,
): string {
  const queryString = toPairs(queryParams)
    .map(([a, b]) => `${encodeURIComponent(a)}=${encodeURIComponent(b)}`)
    .join("&");
  return queryString ? `?${queryString}` : "";
}

export const Link: React.FC<{ href: string; title: string }> = ({
  href,
  title,
  children,
  ...props
}): React.ReactElement => (
  <a
    href={href}
    title={title}
    {...props}
    onClick={(event): void => {
      event.preventDefault();
      navigate(href);
    }}
  >
    {children}
  </a>
);

export const ScrollToTop: React.FC<{ children: React.ReactElement }> = ({
  children,
}): React.ReactElement => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [children]);
  return children;
};
