import { IntlShape } from "react-intl";

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
      moveInterest: localizedEnumStrings(enumName: "MoveInterest") {
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
    organizationTypeInterest {
      value
      label {
        en
        fr
        localized
      }
    }
    moveInterest {
      value
      label {
        en
        fr
        localized
      }
    }
    mentorshipStatus {
      value
      label {
        en
        fr
        localized
      }
    }
    mentorshipInterest {
      value
      label {
        en
        fr
        localized
      }
    }
    execInterest
    execCoachingStatus {
      value
      label {
        en
        fr
        localized
      }
    }
    execCoachingInterest {
      value
      label {
        en
        fr
        localized
      }
    }
  }
`);

export const getLabels = (intl: IntlShape) => ({
  organizationTypeInterest: intl.formatMessage({
    defaultMessage: "Types of organizations you’d like to work for",
    id: "vaxlr+",
    description:
      "Label for an employee profile career development preference field",
  }),
  moveInterest: intl.formatMessage({
    defaultMessage: "Interest in promotions and lateral moves",
    id: "lW24T5",
    description:
      "Label for an employee profile career development preference field",
  }),
  mentorshipStatus: intl.formatMessage({
    defaultMessage: "Mentorship status",
    id: "B524m1",
    description:
      "Label for an employee profile career development preference field",
  }),
  mentorshipInterest: intl.formatMessage({
    defaultMessage: "Interest in mentorship opportunities",
    id: "IQiTZd",
    description:
      "Label for an employee profile career development preference field",
  }),
  execInterest: intl.formatMessage({
    defaultMessage: "Interest in executive level opportunities",
    id: "gDoGSs",
    description:
      "Label for an employee profile career development preference field",
  }),
  execInterestContext: intl.formatMessage({
    defaultMessage:
      "Please note that this expression of interest does not necessarily guarantee that you'll be considered for executive level roles. Interest is paired with your career experience and skills to provide recruiters with a holistic picture of whether you'd be a good fit.",
    id: "xnxf8m",
    description:
      "Context for an employee profile career development preference field",
  }),
  execCoachingStatus: intl.formatMessage({
    defaultMessage: "Executive coaching status",
    id: "I+TGU3",
    description:
      "Label for an employee profile career development preference field",
  }),
  execCoachingInterest: intl.formatMessage({
    defaultMessage: "Interest in executive coaching opportunities",
    id: "wJ5KIL",
    description:
      "Label for an employee profile career development preference field",
  }),
  execCoachingInterestContext: intl.formatMessage({
    defaultMessage:
      "Please note that only eligible employees will be considered for executive coaching opportunities. Eligibility will depend on your classification level and organization structure.",
    id: "sxCR5N",
    description:
      "Context for an employee profile career development preference field",
  }),
});

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
