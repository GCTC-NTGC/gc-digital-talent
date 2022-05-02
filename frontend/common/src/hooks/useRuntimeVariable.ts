interface HasServerConfig {
  __SERVER_CONFIG__?: Map<string, string>;
}

/**
 * A hook to retrieve an environment variable value from the window object
 */
export const useRuntimeVariable = (name: string): string | undefined => {
  const windowWithConfig = window as unknown as HasServerConfig;
  // eslint-disable-next-line no-underscore-dangle
  return windowWithConfig.__SERVER_CONFIG__?.get(name);
};

export default useRuntimeVariable;
