const apiHost =
  typeof API_HOST === "undefined" || API_HOST === "" ? undefined : API_HOST;

function getTokenRefreshPath() {
  return apiHost ? new URL("refresh", apiHost).toString() : "/refresh";
}

export default getTokenRefreshPath;
