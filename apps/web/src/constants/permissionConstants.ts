import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

const permissionConstants: Readonly<Record<string, RoleName[]>> = {
  viewCandidates: [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ],
  viewProcesses: [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ],
  createProcess: [ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin],
  viewRequests: [
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PlatformAdmin,
  ],
  viewUsers: [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ],
  viewCommunityTalent: [
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityTalentCoordinator,
  ],
  viewCommunityTalentNominations: [ROLE_NAME.CommunityTalentCoordinator],
};

export default permissionConstants;
