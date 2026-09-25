/**
 * Resolves a redirect target against the app's origin
 *
 * @param {string} target - The redirect target to resolve
 * @param {string} appOrigin - The origin of the running app
 * @returns {string | null} The path, search and hash to redirect to, or null if the target resolves to another origin
 */
export function getSafeRedirectPath(
  target: string,
  appOrigin: string,
): string | null {
  let resolved: URL;
  try {
    resolved = new URL(target, appOrigin);
  } catch {
    return null;
  }

  if (resolved.origin !== appOrigin) {
    return null;
  }

  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}
