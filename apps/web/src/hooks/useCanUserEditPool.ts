import { useAuthorization, hasRole } from "@gc-digital-talent/auth";
import { Maybe, PoolStatus } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import permissionConstants from "~/constants/permissionConstants";

const useCanUserEditPool = (status?: Maybe<PoolStatus>) => {
  const { userAuthInfo } = useAuthorization();
  const unpackedRoleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);

  if (status === PoolStatus.Draft) return true;

  if (status === PoolStatus.Published) {
    return hasRole(
      permissionConstants().publishProcess,
      unpackedRoleAssignments,
    );
  }

  return false;
};

export default useCanUserEditPool;
