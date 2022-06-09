import { createBrowserHistory, Location, Path, State } from "history";
import UniversalRouter, { Routes } from "universal-router";
import React, { useState, useEffect, useMemo, ReactElement } from "react";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { AuthenticationContext } from "../components/Auth";
import { Role } from "../api/generated";
import { AuthorizationContext } from "../components/Auth/AuthorizationContainer";
import { useApiRoutes } from "../hooks/useApiRoutes";
import { getLocale } from "./localize";
import { empty } from "./util";

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
  component?: ReactElement;
  redirect?: string;
  authorizedRoles?: Array<Role>;
}

export const useRouter = (
  routes: Routes<RouterResult>,
  missingRouteComponent: ReactElement,
  notAuthorizedComponent: ReactElement,
  welcomeRoute?: string,
): React.ReactElement | null => {
  const location = useLocation();
  const router = useMemo(() => new UniversalRouter(routes), [routes]);
  const [component, setComponent] = useState<React.ReactElement | null>(null);
  const pathName = location.pathname;
  const apiRoutes = useApiRoutes();
  const locale = getLocale(useIntl());
  const { loggedIn } = React.useContext(AuthenticationContext);
  const {
    loggedInUserRoles,
    loggedInEmail,
    isLoaded: authorizationLoaded,
  } = React.useContext(AuthorizationContext);
  // Render the result of routing
  useEffect((): void => {
    router
      .resolve(pathName)
      .then(async (routeMaybePromise) => {
        // may or may not be a promise, so attempt to resolve it. A non-promise value will simply resolve to itself.
        const route = await Promise.resolve(routeMaybePromise);

        /**
         * Check the following then redirect to welcome page
         *  - Application has a welcome page
         *  - User Logged in
         *  - Authorization query is not loading
         *  - User has no email associated with account
         */
        if (
          welcomeRoute &&
          loggedIn &&
          authorizationLoaded &&
          empty(loggedInEmail)
        ) {
          redirect(welcomeRoute);
          return null;
        }

        // handling a redirect
        if (route?.redirect) {
          redirect(route.redirect);
        }

        // is authorization required for this route?
        const authorizedRoles = route?.authorizedRoles ?? [];
        const authorizationRequired = authorizedRoles.length > 0;

        // if the user is not logged in then go to login page with "from" option to come back
        if (authorizationRequired && !loggedIn) {
          window.location.href = apiRoutes.login(pathName, locale);
          return null; // we're leaving the site - don't try to route any further
        }

        // is the user authorized for this route?
        let isAuthorized: boolean;

        // if there is a list of authorized roles required then let's see if the user is authorized
        if (authorizationRequired) {
          // the user is considered authorized if there are no roles needed or they have at least one of the required roles
          isAuthorized =
            authorizedRoles.length === 0 ||
            authorizedRoles.some((authorizedRole: Role) =>
              loggedInUserRoles?.includes(authorizedRole),
            );
        } else {
          // if no authorized roles are specified then the user is authorized by default
          isAuthorized = true;
        }

        // handling a component
        if (route?.component) {
          if (isAuthorized) {
            setComponent(route.component);
          } else {
            setComponent(notAuthorizedComponent);
          }
        }
        return null;
      })
      .catch(async () => {
        setComponent(missingRouteComponent);
      });
  }, [
    apiRoutes,
    loggedIn,
    locale,
    loggedInUserRoles,
    loggedInEmail,
    missingRouteComponent,
    notAuthorizedComponent,
    pathName,
    router,
    welcomeRoute,
    authorizationLoaded,
  ]);

  return component;
};

/**
 *
 * @param imgFile The name of the img file, not including the /images/ path.
 */
export function imageUrl(baseUrl: string, imgFile: string): string {
  return path.join(baseUrl, "/images/", imgFile);
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
