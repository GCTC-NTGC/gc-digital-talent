/**
 * Checks if the provided URL matches the current app's host name
 *
 * @param {string} url - The URL to test
 * @returns {boolean} True if the URL matches the current host name
 */
export function urlMatchesAppHostName(url: string): boolean {
  const pattern = new URLPattern({ hostname: window.location.hostname });
  return pattern.test(url);
}
