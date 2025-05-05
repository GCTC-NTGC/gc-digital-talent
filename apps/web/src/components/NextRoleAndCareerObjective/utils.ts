import { IntlShape } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import messages from "./messages";

export const NextRoleInfo_Fragment = graphql(/* GraphQL */ `
  fragment NextRoleInfo on EmployeeProfile {
    nextRoleClassification {
      id
      group
      level
    }
    nextRoleTargetRole {
      value
      label {
        localized
      }
    }
    nextRoleTargetRoleOther
    nextRoleJobTitle
    nextRoleCommunity {
      id
      key
      name {
        localized
      }
      workStreams {
        id
      }
    }
    nextRoleCommunityOther
    nextRoleWorkStreams {
      id
      name {
        localized
      }
    }
    nextRoleDepartments {
      id
      departmentNumber
      name {
        localized
      }
    }
    nextRoleAdditionalInformation
    nextRoleIsCSuiteRole
    nextRoleCSuiteRoleTitle {
      value
      label {
        localized
      }
    }
  }
`);

export const CareerObjectiveInfo_Fragment = graphql(/* GraphQL */ `
  fragment CareerObjectiveInfo on EmployeeProfile {
    careerObjectiveClassification {
      id
      group
      level
    }
    careerObjectiveTargetRole {
      value
      label {
        localized
      }
    }
    careerObjectiveTargetRoleOther
    careerObjectiveJobTitle
    careerObjectiveCommunity {
      id
      key
      name {
        localized
      }
      workStreams {
        id
      }
    }
    careerObjectiveCommunityOther
    careerObjectiveWorkStreams {
      id
      name {
        localized
      }
    }
    careerObjectiveDepartments {
      id
      departmentNumber
      name {
        localized
      }
    }
    careerObjectiveAdditionalInformation
    careerObjectiveIsCSuiteRole
    careerObjectiveCSuiteRoleTitle {
      value
      label {
        localized
      }
    }
  }
`);

// bespoke rendering of community field
export const handleCommunity = (
  communityNameLocalized: string | null | undefined,
  communityOther: string | null | undefined,
  intl: IntlShape,
): string => {
  if (communityNameLocalized) {
    return communityNameLocalized;
  } else if (communityOther) {
    return intl.formatMessage(messages.otherCommunity);
  }

  return intl.formatMessage(commonMessages.missingOptionalInformation);
};
