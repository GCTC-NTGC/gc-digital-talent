import { useAuthorization, ROLE_NAME, hasRole } from "@gc-digital-talent/auth";
import { Maybe, PoolStatus } from "@gc-digital-talent/graphql";

const useCanUserEditPool = (status?: Maybe<PoolStatus>) => {
  const { userAuthInfo } = useAuthorization();

  if (status === PoolStatus.Draft) return true;

  if (status === PoolStatus.Published) {
    return hasRole(
      [ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin],
      userAuthInfo?.roleAssignments,
    );
  }

  return false;
};

export default useCanUserEditPool;
