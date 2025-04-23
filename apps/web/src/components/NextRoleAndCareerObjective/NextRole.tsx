import { FragmentType, getFragment } from "@gc-digital-talent/graphql";

import { NextRoleInfo_Fragment } from "./utils";
import Display from "./Display";

interface NextRoleProps {
  nextRoleQuery: FragmentType<typeof NextRoleInfo_Fragment>;
}

const NextRole = ({ nextRoleQuery }: NextRoleProps) => {
  const nextRole = getFragment(NextRoleInfo_Fragment, nextRoleQuery);
  const {
    nextRoleClassification,
    nextRoleTargetRole,
    nextRoleTargetRoleOther,
    nextRoleJobTitle,
    nextRoleCommunity,
    nextRoleCommunityOther,
    nextRoleWorkStreams,
    nextRoleDepartments,
    nextRoleAdditionalInformation,
    nextRoleIsCSuiteRole,
    nextRoleCSuiteRoleTitle,
  } = nextRole;

  return (
    <Display
      classification={nextRoleClassification}
      targetRole={nextRoleTargetRole}
      targetRoleOther={nextRoleTargetRoleOther}
      jobTitle={nextRoleJobTitle}
      community={nextRoleCommunity}
      communityOther={nextRoleCommunityOther}
      workStreams={nextRoleWorkStreams}
      departments={nextRoleDepartments}
      additionalInformation={nextRoleAdditionalInformation}
      isCSuiteRole={nextRoleIsCSuiteRole}
      cSuiteRoleTitle={nextRoleCSuiteRoleTitle}
    />
  );
};

export default NextRole;
