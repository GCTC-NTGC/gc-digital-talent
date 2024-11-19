import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

const permissionConstants = () => {
  const viewCandidates: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ];
  const placeCandidates: RoleName[] = [
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
  ];
  const viewJobTemplates: RoleName[] = [ROLE_NAME.PoolOperator];
  const viewProcesses: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
  ];
  const publishProcess: RoleName[] = [
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityAdmin,
  ];
  const duplicateProcess: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ];
  const archiveProcess: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ];
  const deleteProcess: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ];
  // manage Process Access means assigning Pool Operator roles to users
  const manageProcessAccess: RoleName[] = [
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ];

  const viewRequests: RoleName[] = [
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ];
  const viewUsers: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PlatformAdmin,
  ];
  // manage Team members means assigning team-based roles within a team.
  const manageTeamMembers: RoleName[] = [
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ];

  return {
    viewCandidates,
    placeCandidates,
    viewJobTemplates,
    viewProcesses,
    publishProcess,
    duplicateProcess,
    archiveProcess,
    deleteProcess,
    manageProcessAccess,
    viewRequests,
    viewUsers,
    manageTeamMembers,
  };
};

export default permissionConstants;
