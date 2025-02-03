import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

const permissionConstants: Readonly<Record<string, RoleName[]>> = {
  viewCandidates: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.PlatformAdmin,
  ],
  evaluateCandidates: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ],
  placeCandidates: [
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
  ],
  viewJobTemplates: [ROLE_NAME.PoolOperator],
  createProcess: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ],
  viewProcesses: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ],
  editProcess: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ],

  publishProcess: [ROLE_NAME.CommunityManager, ROLE_NAME.CommunityAdmin],
  archiveProcess: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ],
  deleteProcess: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ],
  // manage Process Access means assigning Pool Operator roles to users
  manageProcessAccess: [ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin],

  viewRequests: [
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
  ],
  viewOwnRequests: [ROLE_NAME.Manager], // Only managers have their own requests
  viewUsers: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PlatformAdmin,
  ],
  viewUserProfile: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.ProcessOperator,
  ],
  viewTeams: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ],
  editTeam: [ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin],
  // manage Team members means assigning team-based roles within a team.
  manageTeamMembers: [ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin],
  viewCommunities: [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ],
  viewCommunityMembers: [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.PlatformAdmin,
  ],
  managePlatformData: [ROLE_NAME.PlatformAdmin],
  isApplicant: [ROLE_NAME.Applicant],
  viewManagerDashboard: [ROLE_NAME.Manager],
  viewCommunityDashboard: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.ProcessOperator,
  ],
  viewAdminDashboard: [
    ROLE_NAME.PoolOperator,
    ROLE_NAME.RequestResponder,
    ROLE_NAME.CommunityManager,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.PlatformAdmin,
  ],
  canManageAccessCommunities: [
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.CommunityAdmin,
  ],
  createCommunities: [ROLE_NAME.PlatformAdmin],
};

export default permissionConstants;
