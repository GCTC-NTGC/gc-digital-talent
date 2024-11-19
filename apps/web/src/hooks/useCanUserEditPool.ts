import { useAuthorization, hasRole } from "@gc-digital-talent/auth";
import { Maybe, PoolStatus } from "@gc-digital-talent/graphql";

import permissionConstants from "~/constants/permissionConstants";

const useCanUserEditPool = (status?: Maybe<PoolStatus>) => {
  const { userAuthInfo } = useAuthorization();

  if (status === PoolStatus.Draft) return true;

  if (status === PoolStatus.Published) {
    return hasRole(
      permissionConstants().publishProcess,
      userAuthInfo?.roleAssignments,
    );
  }

  return false;
};

export default useCanUserEditPool;
