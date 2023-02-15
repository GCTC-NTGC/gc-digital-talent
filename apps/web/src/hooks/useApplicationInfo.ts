import { useSearchParams } from "react-router-dom";

import { Scalars } from "~/api/generated";

import useRoutes from "./useRoutes";

/**
 * Use Application Info
 *
 * Retrieves the current application context
 * from search params returning its ID
 * and a path to return to it.
 *
 * @param userId (optional) The ID of the applications user
 * @returns {id: applicationID, returnRoute: Path to the current application}
 */
const useApplicationInfo = (userId?: Scalars["ID"]) => {
  const paths = useRoutes();
  const [searchParams] = useSearchParams();

  let id;
  // If we do not have a userId, we can let the profile redirect handle it
  let returnRoute = userId ? paths.profile(userId) : paths.myProfile();

  if (searchParams.has("applicationId")) {
    id = searchParams.get("applicationId");
    if (id) {
      returnRoute = paths.reviewApplication(id);
    }
  }

  return {
    id,
    returnRoute,
  };
};

export default useApplicationInfo;
