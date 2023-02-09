import { useSearchParams } from "react-router-dom";

import { Scalars } from "~/api/generated";

import useRoutes from "./useRoutes";

const useApplicationInfo = (userId?: Scalars["ID"]) => {
  const paths = useRoutes();
  const [searchParams] = useSearchParams();

  let id;
  let param;
  // If we do not have a userId, we can let the profile redirect handle it
  let returnRoute = userId ? paths.profile(userId) : paths.myProfile();

  if (searchParams.has("applicationId")) {
    id = searchParams.get("applicationId");
    if (id) {
      param = `?${searchParams.toString()}`;
      returnRoute = paths.reviewApplication(id);
    }
  }

  return {
    id,
    param,
    returnRoute,
  };
};

export default useApplicationInfo;
