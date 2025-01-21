import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

const permissionConstants = () => {
  const viewCandidates: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ];
  const evaluateCandidates: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ];
  const placeCandidates: RoleName[] = [
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
  ];
  const viewJobTemplates: RoleName[] = [ROLE_NAME.PoolOperator];
  const createProcess: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ];
  const viewProcesses: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ];
  const editProcess: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ];

  const publishProcess: RoleName[] = [
    ROLE_NAME.CommunityManager,
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
  const viewOwnRequests: RoleName[] = [ROLE_NAME.Manager]; // Only managers have their own requests
  const viewUsers: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PlatformAdmin,
  ];
  const viewUserProfile: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ];
  const viewTeams: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ];
  const editTeam: RoleName[] = [
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ];
  // manage Team members means assigning team-based roles within a team.
  const manageTeamMembers: RoleName[] = [
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ];
  const viewCommunities: RoleName[] = [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ];
  const viewCommunityMembers: RoleName[] = [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ];
  const managePlatformData: RoleName[] = [ROLE_NAME.PlatformAdmin];
  const isApplicant: RoleName[] = [ROLE_NAME.Applicant];
  const viewManagerDashboard: RoleName[] = [ROLE_NAME.Manager];
  const viewCommunityDashboard: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.ProcessOperator,
  ];
  const viewAdminDashboard: RoleName[] = [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PlatformAdmin,
  ];

  return {
    viewCandidates,
    evaluateCandidates,
    placeCandidates,
    viewJobTemplates,
    createProcess,
    viewProcesses,
    editProcess,
    publishProcess,
    archiveProcess,
    deleteProcess,
    manageProcessAccess,
    viewRequests,
    viewOwnRequests,
    viewUsers,
    viewUserProfile,
    viewTeams,
    editTeam,
    manageTeamMembers,
    viewCommunities,
    viewCommunityMembers,
    managePlatformData,
    isApplicant,
    viewCommunityDashboard,
    viewManagerDashboard,
    viewAdminDashboard,
  };
};

export default permissionConstants;
