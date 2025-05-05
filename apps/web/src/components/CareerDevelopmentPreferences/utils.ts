import {
  CareerDevelopmentPreferencesFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  ExecCoachingStatus,
  getExecCoachingStatus,
  getMentorshipStatus,
  MentorshipStatus,
} from "@gc-digital-talent/i18n";

export const CareerDevelopmentPreferencesOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment CareerDevelopmentPreferencesOptions on Query {
      organizationTypeInterest: localizedEnumStrings(
        enumName: "OrganizationTypeInterest"
      ) {
        value
        label {
          en
          fr
          localized
        }
      }
      timeFrame: localizedEnumStrings(enumName: "TimeFrame") {
        value
        label {
          en
          fr
          localized
        }
      }
      mentorship: localizedEnumStrings(enumName: "Mentorship") {
        value
        label {
          en
          fr
          localized
        }
      }
      execCoaching: localizedEnumStrings(enumName: "ExecCoaching") {
        value
        label {
          en
          fr
          localized
        }
      }
      learningOpportunitiesInterest: localizedEnumStrings(
        enumName: "LearningOpportunitiesInterest"
      ) {
        value
        label {
          en
          fr
          localized
        }
      }
    }
  `,
);

export const CareerDevelopmentPreferences_Fragment = graphql(/* GraphQL */ `
  fragment CareerDevelopmentPreferences on EmployeeProfile {
    lateralMoveInterest
    lateralMoveTimeFrame {
      value
      label {
        localized
      }
    }
    lateralMoveOrganizationType {
      value
      label {
        localized
      }
    }
    promotionMoveInterest
    promotionMoveTimeFrame {
      value
      label {
        localized
      }
    }
    promotionMoveOrganizationType {
      value
      label {
        localized
      }
    }
    learningOpportunitiesInterest {
      value
      label {
        localized
      }
    }
    eligibleRetirementYearKnown
    eligibleRetirementYear
    mentorshipStatus {
      value
      label {
        localized
      }
    }
    mentorshipInterest {
      value
      label {
        localized
      }
    }
    execInterest
    execCoachingStatus {
      value
      label {
        localized
      }
    }
    execCoachingInterest {
      value
      label {
        localized
      }
    }
  }
`);

export const displayMentorshipStatus = (
  mentorshipStatus: CareerDevelopmentPreferencesFragment["mentorshipStatus"],
) => {
  if (!mentorshipStatus) {
    return commonMessages.notProvided;
  }

  if (mentorshipStatus.length === 1) {
    return getMentorshipStatus(mentorshipStatus[0].value);
  }

  if (mentorshipStatus.length === 2) {
    return getMentorshipStatus(MentorshipStatus.MENTEE_AND_MENTOR);
  }

  return getMentorshipStatus(MentorshipStatus.NOT_PARTICIPATING);
};

export const displayExecCoachingStatus = (
  execCoachingStatus: CareerDevelopmentPreferencesFragment["execCoachingStatus"],
) => {
  if (!execCoachingStatus) {
    return commonMessages.notProvided;
  }

  if (execCoachingStatus.length === 1) {
    return getExecCoachingStatus(execCoachingStatus[0].value);
  }

  if (execCoachingStatus.length === 2) {
    return getExecCoachingStatus(ExecCoachingStatus.LEARNING_AND_COACHING);
  }

  return getExecCoachingStatus(ExecCoachingStatus.NOT_PARTICIPATING);
};
