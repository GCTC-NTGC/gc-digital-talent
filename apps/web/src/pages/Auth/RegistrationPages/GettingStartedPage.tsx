import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import { GettingStartedPage } from "./GettingStartedPage/GettingStartedPage";
import { GettingStartedPage as GettingStartedPageDeprecated } from "./GettingStartedPageDeprecated/GettingStartedPage";

/**
 * This is a simple component to conditionally render the two versions of the page.
 * Once the transition is complete, the component can be moved back into the
 * newer version of the page and the older one can get removed.
 */
export const Component = () => {
  const featureFlags = useFeatureFlags();
  return (
    <RequireAuth roles={[ROLE_NAME.Applicant]}>
      {featureFlags.canadaLogin ? (
        <GettingStartedPage />
      ) : (
        <GettingStartedPageDeprecated />
      )}
    </RequireAuth>
  );
};

export default GettingStartedPage;
