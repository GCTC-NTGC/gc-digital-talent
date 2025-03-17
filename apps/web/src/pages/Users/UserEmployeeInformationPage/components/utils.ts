import { EmployeeProfileCareerDevelopmentFragment } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  ExecCoachingStatus,
  getExecCoachingStatus,
  getMentorshipStatus,
  MentorshipStatus,
} from "@gc-digital-talent/i18n";

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
