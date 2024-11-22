import { ROLE_NAME } from "@gc-digital-talent/auth";

const permissionConstants = {
  viewCandidates: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ],
  viewProcesses: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ],
  createProcess: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ],
  viewRequests: [
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PlatformAdmin,
  ],
  viewUsers: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ],
};

export default permissionConstants;
