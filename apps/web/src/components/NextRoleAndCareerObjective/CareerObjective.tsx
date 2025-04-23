import { FragmentType, getFragment } from "@gc-digital-talent/graphql";

import { CareerObjectiveInfo_Fragment } from "./utils";
import Display from "./Display";

interface CareerObjectiveProps {
  careerObjectiveQuery: FragmentType<typeof CareerObjectiveInfo_Fragment>;
}

const CareerObjective = ({ careerObjectiveQuery }: CareerObjectiveProps) => {
  const careerObjective = getFragment(
    CareerObjectiveInfo_Fragment,
    careerObjectiveQuery,
  );
  const {
    careerObjectiveClassification,
    careerObjectiveTargetRole,
    careerObjectiveTargetRoleOther,
    careerObjectiveJobTitle,
    careerObjectiveCommunity,
    careerObjectiveCommunityOther,
    careerObjectiveWorkStreams,
    careerObjectiveDepartments,
    careerObjectiveAdditionalInformation,
    careerObjectiveIsCSuiteRole,
    careerObjectiveCSuiteRoleTitle,
  } = careerObjective;

  return (
    <Display
      classification={careerObjectiveClassification}
      targetRole={careerObjectiveTargetRole}
      targetRoleOther={careerObjectiveTargetRoleOther}
      jobTitle={careerObjectiveJobTitle}
      community={careerObjectiveCommunity}
      communityOther={careerObjectiveCommunityOther}
      workStreams={careerObjectiveWorkStreams}
      departments={careerObjectiveDepartments}
      additionalInformation={careerObjectiveAdditionalInformation}
      isCSuiteRole={careerObjectiveIsCSuiteRole}
      cSuiteRoleTitle={careerObjectiveCSuiteRoleTitle}
    />
  );
};

export default CareerObjective;
