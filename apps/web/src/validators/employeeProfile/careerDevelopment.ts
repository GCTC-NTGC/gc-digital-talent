import { EmployeeProfile } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

export function hasAllEmptyFields({
  lateralMoveInterest,
  lateralMoveTimeFrame,
  lateralMoveOrganizationType,
  promotionMoveInterest,
  promotionMoveTimeFrame,
  promotionMoveOrganizationType,
  mentorshipStatus,
  mentorshipInterest,
  execInterest,
  execCoachingStatus,
  execCoachingInterest,
}: Pick<
  EmployeeProfile,
  | "lateralMoveInterest"
  | "lateralMoveTimeFrame"
  | "lateralMoveOrganizationType"
  | "promotionMoveInterest"
  | "promotionMoveTimeFrame"
  | "promotionMoveOrganizationType"
  | "mentorshipStatus"
  | "mentorshipInterest"
  | "execInterest"
  | "execCoachingInterest"
  | "execCoachingStatus"
>): boolean {
  return (
    empty(lateralMoveInterest) &&
    !lateralMoveTimeFrame &&
    !lateralMoveOrganizationType &&
    empty(promotionMoveInterest) &&
    !promotionMoveTimeFrame &&
    !promotionMoveOrganizationType &&
    !mentorshipStatus &&
    !mentorshipInterest &&
    empty(execInterest) &&
    !execCoachingStatus &&
    !execCoachingInterest
  );
}

export function hasEmptyRequiredFields({
  lateralMoveInterest,
  promotionMoveInterest,
  mentorshipStatus,
  execInterest,
  execCoachingStatus,
}: Pick<
  EmployeeProfile,
  | "lateralMoveInterest"
  | "promotionMoveInterest"
  | "mentorshipStatus"
  | "execInterest"
  | "execCoachingStatus"
>): boolean {
  return (
    empty(lateralMoveInterest) ||
    empty(promotionMoveInterest) ||
    !mentorshipStatus ||
    empty(execInterest) ||
    !execCoachingStatus
  );
}
