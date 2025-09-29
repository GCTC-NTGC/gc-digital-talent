// versionHelpers.ts
import { ComponentType } from "react";

/**
 * Returns the closest supported component ≤ requested version
 */
export function getSupportedVersionComponent<TProps>(
  components: Record<number, ComponentType<TProps>>,
  version: number,
): ComponentType<TProps> | null {
  const availableVersions = Object.keys(components)
    .map(Number)
    .sort((a, b) => b - a); // descending

  for (const v of availableVersions) {
    if (v <= version) return components[v];
  }
  return null;
}
