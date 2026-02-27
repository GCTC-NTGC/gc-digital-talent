import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

const permissionConstants: Readonly<Record<string, RoleName[]>> = {
  viewCandidates: [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.DepartmentAdmin,
    ROLE_NAME.DepartmentHRAdvisor,
  ],
  viewProcesses: [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.DepartmentAdmin,
    ROLE_NAME.DepartmentHRAdvisor,
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
    ROLE_NAME.PlatformAdmin,
  ],
  viewCommunityTalentNominations: [
    ROLE_NAME.CommunityTalentCoordinator,
    ROLE_NAME.PlatformAdmin,
  ],
};

export default permissionConstants;
