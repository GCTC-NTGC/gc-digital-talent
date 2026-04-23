// versionHelpers.ts
import type { ComponentType } from "react";

/**
 * Returns the closest supported component ≤ requested version
 */
export function getSupportedVersionComponent<TProps>(
  components: Record<number, ComponentType<TProps>>,
  version = 1,
): ComponentType<TProps> | null {
  const availableVersions = Object.keys(components)
    .map(Number)
    .sort((a, b) => b - a); // descending

  for (const v of availableVersions) {
    if (v <= version) return components[v];
  }
  return null;
}
