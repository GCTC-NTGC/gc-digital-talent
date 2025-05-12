import { useAuthorization, ROLE_NAME } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Maybe, PoolStatus } from "@gc-digital-talent/graphql";

import { checkRole } from "../utils/teamUtils";

const useCanUserEditPool = (status?: Maybe<PoolStatus>) => {
  const { userAuthInfo } = useAuthorization();

  if (status === PoolStatus.Draft) return true;

  if (status === PoolStatus.Published) {
    return checkRole(
      [ROLE_NAME.PlatformAdmin],
      unpackMaybes(userAuthInfo?.roleAssignments),
    );
  }

  return false;
};

export default useCanUserEditPool;
