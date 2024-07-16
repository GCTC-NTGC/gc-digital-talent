import path from "path-browserify";

interface ApiRoutes {
  login: (from?: string, locale?: string) => string;
  refreshAccessToken: () => string;
  userGeneratedFile: (fileName: string) => string;
}

const isDevServer =
  typeof IS_DEV_SERVER !== "undefined" ? IS_DEV_SERVER : false;

const apiHost =
  typeof API_HOST === "undefined" || API_HOST === "" ? undefined : API_HOST;

const apiRoutes = {
  login: (from?: string, locale?: string): string => {
    const searchTerms: string[] = [];
    if (from) searchTerms.push(`from=${encodeURI(from)}`);
    if (locale) searchTerms.push(`locale=${encodeURI(locale)}`);
    if (isDevServer) searchTerms.push(`devServer=${encodeURI("true")}`);
    const searchString = searchTerms.join("&");

    const loginPath = `login${searchString ? `?${searchString}` : ""}`;

    const url = apiHost
      ? new URL(loginPath, apiHost)
      : path.join("/", "login") + (searchString ? `?${searchString}` : "");

    return url.toString();
  },
  refreshAccessToken: (): string =>
    apiHost ? new URL("refresh", apiHost).toString() : "/refresh",
  userGeneratedFile: (fileName: string): string => {
    const filePath = `api/user-generated-files/${fileName}`;
    return apiHost ? new URL(filePath, apiHost).toString() : filePath;
  },
};
export default apiRoutes;

/**
 * A hook version of loginRoutes which gets the locale from the intl context.
 * @returns LoginRoutes
 */
export const useApiRoutes = (): ApiRoutes => {
  return apiRoutes;
};
