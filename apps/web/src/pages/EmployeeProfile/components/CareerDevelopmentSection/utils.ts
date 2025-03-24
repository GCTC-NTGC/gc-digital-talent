import {
  EmployeeProfile,
  EmployeeProfileCareerDevelopmentFragment,
  ExecCoaching,
  graphql,
  Mentorship,
  UpdateEmployeeProfileInput,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  ExecCoachingStatus,
  getExecCoachingStatus,
  getMentorshipStatus,
  MentorshipStatus,
} from "@gc-digital-talent/i18n";

import { FormValues } from "./CareerDevelopmentSection";

export const EmployeeProfileCareerDevelopmentOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment EmployeeProfileCareerDevelopmentOptions on Query {
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
    }
  `,
);

export const EmployeeProfileCareerDevelopment_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileCareerDevelopment on EmployeeProfile {
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

export const mentorshipStatusToFormValues = (
  mentorshipStatus: EmployeeProfile["mentorshipStatus"],
) => {
  if (!mentorshipStatus) return null;

  // If the list is empty, return not participating
  if (mentorshipStatus.length === 0) {
    return MentorshipStatus.NOT_PARTICIPATING;
  }

  // If one element is in the list, determine if it's mentee or mentor
  if (mentorshipStatus.length === 1) {
    if (mentorshipStatus[0].value === MentorshipStatus.MENTEE) {
      return MentorshipStatus.MENTEE;
    } else {
      return MentorshipStatus.MENTOR;
    }
  }

  // If both mentee and mentor are in the list, return mentee_and_mentor
  if (mentorshipStatus.length === 2) {
    return MentorshipStatus.MENTEE_AND_MENTOR;
  }

  // if it has more than 2 elements return null
  return null;
};

export const mentorshipStatusToData = (
  mentorshipStatus: FormValues["mentorshipStatus"],
): UpdateEmployeeProfileInput["mentorshipStatus"] => {
  if (mentorshipStatus === MentorshipStatus.MENTEE) {
    return [Mentorship.Mentee];
  }

  if (mentorshipStatus === MentorshipStatus.MENTOR) {
    return [Mentorship.Mentor];
  }

  if (mentorshipStatus === MentorshipStatus.MENTEE_AND_MENTOR) {
    return [Mentorship.Mentee, Mentorship.Mentor];
  }

  return []; // return empty string if not participating
};

export const displayMentorshipStatus = (
  mentorshipStatus: EmployeeProfileCareerDevelopmentFragment["mentorshipStatus"],
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

export const execCoachingStatusToFormValues = (
  execCoachingStatus: EmployeeProfile["execCoachingStatus"],
) => {
  if (!execCoachingStatus) return null;

  // If the list is empty, return not participating
  if (execCoachingStatus.length === 0) {
    return ExecCoachingStatus.NOT_PARTICIPATING;
  }

  // If one element is in the list, determine if it's learning or coaching
  if (execCoachingStatus.length === 1) {
    if (execCoachingStatus[0].value === ExecCoachingStatus.LEARNING) {
      return ExecCoachingStatus.LEARNING;
    } else {
      return ExecCoachingStatus.COACHING;
    }
  }

  // If both mentee and mentor are in the list, return learning_and_coaching
  if (execCoachingStatus.length === 2) {
    return ExecCoachingStatus.LEARNING_AND_COACHING;
  }

  // if it has more than 2 elements return null
  return null;
};

export const execCoachingStatusToData = (
  execCoachingStatus: FormValues["execCoachingStatus"],
): UpdateEmployeeProfileInput["execCoachingStatus"] => {
  if (execCoachingStatus === ExecCoachingStatus.LEARNING) {
    return [ExecCoaching.Learning];
  }

  if (execCoachingStatus === ExecCoachingStatus.COACHING) {
    return [ExecCoaching.Coaching];
  }

  if (execCoachingStatus === ExecCoachingStatus.LEARNING_AND_COACHING) {
    return [ExecCoaching.Learning, ExecCoaching.Coaching];
  }

  return []; // return empty string if not participating
};

export const displayExecCoachingStatus = (
  execCoachingStatus: EmployeeProfileCareerDevelopmentFragment["execCoachingStatus"],
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
