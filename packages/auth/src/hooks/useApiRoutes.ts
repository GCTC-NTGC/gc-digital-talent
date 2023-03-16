import path from "path-browserify";

export interface ApiRoutes {
  login: (from?: string, locale?: string) => string;
  refreshAccessToken: () => string;
}

const apiRoot = (): string => "http://api.localhost:8000/"; // this should be an environment variable

const apiRoutes = {
  login: (from?: string, locale?: string): string => {
    const searchTerms: string[] = [];
    if (from) searchTerms.push(`from=${encodeURI(from)}`);
    if (locale) searchTerms.push(`locale=${encodeURI(locale)}`);
    const searchString = searchTerms.join("&");

    const url =
      new URL("/login", apiRoot()) + (searchString ? `?${searchString}` : "");

    return url;
  },
  refreshAccessToken: (): string => path.join(apiRoot(), "refresh"),
};

export default apiRoutes;

/**
 * A hook version of loginRoutes which gets the locale from the intl context.
 * @returns LoginRoutes
 */
export const useApiRoutes = (): ApiRoutes => {
  return apiRoutes;
};
