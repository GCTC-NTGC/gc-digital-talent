import { RoleName } from "@gc-digital-talent/auth";

const permissionConstants = () => {
  const viewCandidates: RoleName[] = [
    "pool_operator",
    "request_responder",
    "community_recruiter",
    "community_admin",
  ];
  const viewJobTemplates: RoleName[] = ["pool_operator"];
  const viewProcesses: RoleName[] = ["pool_operator", "community_manager"];
  const viewRequests: RoleName[] = [
    "request_responder",
    "community_recruiter",
    "community_admin",
  ];
  const viewUsers: RoleName[] = [
    "pool_operator",
    "request_responder",
    "community_recruiter",
    "community_admin",
    "platform_admin",
  ];

  return {
    viewCandidates,
    viewJobTemplates,
    viewProcesses,
    viewRequests,
    viewUsers,
  };
};

export default permissionConstants;