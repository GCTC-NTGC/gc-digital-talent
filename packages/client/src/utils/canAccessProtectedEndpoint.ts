import { apiHost, protectedUrl } from "../constants";

async function canAccessProtectedEndpoint(): Promise<boolean> {
  const response = await fetch(`${apiHost}${protectedUrl}`, {
    method: "POST",
    body: `{ "query": "{ __typename }" }`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // The firewall will redirect to a restricted page if the user is not allowed to access the endpoint
  if (response.redirected && response.url.endsWith("/restricted.html")) {
    return false;
  }

  // otherwise check if we got an OK
  return response.ok;
}

export default canAccessProtectedEndpoint;
