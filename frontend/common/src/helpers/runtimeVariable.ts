import { isStringTrue } from "./util";

interface HasServerConfig {
  __SERVER_CONFIG__?: Map<string, string>;
}

/**
 * Retrieve an environment variable value from the window object
 */
export const getRuntimeVariable = (name: string): string | undefined => {
  const windowWithConfig = window as unknown as HasServerConfig;
  // eslint-disable-next-line no-underscore-dangle
  return windowWithConfig.__SERVER_CONFIG__?.get(name);
};

/**
 * Retrieve an environment variable value from the window object with error if missing
 */
export const getRuntimeVariableNotNull = (name: string): string => {
  const runtimeVariable = getRuntimeVariable(name);
  if (runtimeVariable) {
    return runtimeVariable;
  }

  // eslint-disable-next-line no-console
  console.error(`Missing mandatory runtime variable: ${name}`);
  return " ";
};

/**
 * A convenience function for runtime variable feature flags
 */
export const checkFeatureFlag = (name: string): boolean => {
  // We use isStringTrue here because an ENV variable which is left undefined may show up as a runtime variable as a string (eg "false" or "(none)") instead of false or undefined.
  return isStringTrue(getRuntimeVariable(name));
};
