export type FeatureFlags = ReturnType<typeof featureFlags>;

interface HasServerConfig {
  __SERVER_CONFIG__?: Map<string, string>;
}

const variableExistsAndIsTrue = (name: string) => {
  const windowWithConfig = window as unknown as HasServerConfig;

  // eslint-disable-next-line no-underscore-dangle
  return windowWithConfig.__SERVER_CONFIG__?.get(name) === "true";
};

const featureFlags = () => {
  return {
    applicantProfile: (): boolean =>
      variableExistsAndIsTrue("FEATURE_APPLICANTPROFILE"),
  };
};

/**
 * A hook version of featureFlags.
 * @returns FeatureFlags
 */
export const useFeatureFlags = (): FeatureFlags => {
  return featureFlags();
};

export default featureFlags;
