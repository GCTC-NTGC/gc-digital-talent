import { EmployeeProfile } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

export function hasAllEmptyFields({
  lateralMoveInterest,
  lateralMoveTimeFrame,
  lateralMoveOrganizationType,
  promotionMoveInterest,
  promotionMoveTimeFrame,
  promotionMoveOrganizationType,
  eligibleRetirementYearKnown,
  eligibleRetirementYear,
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
  | "eligibleRetirementYearKnown"
  | "eligibleRetirementYear"
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
    empty(eligibleRetirementYearKnown) &&
    !eligibleRetirementYear &&
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
  eligibleRetirementYearKnown,
  eligibleRetirementYear,
  mentorshipStatus,
  execInterest,
  execCoachingStatus,
}: Partial<
  Pick<
    EmployeeProfile,
    | "lateralMoveInterest"
    | "promotionMoveInterest"
    | "eligibleRetirementYearKnown"
    | "eligibleRetirementYear"
    | "mentorshipStatus"
    | "execInterest"
    | "execCoachingStatus"
  >
>): boolean {
  return (
    empty(lateralMoveInterest) ||
    empty(promotionMoveInterest) ||
    empty(eligibleRetirementYearKnown) ||
    (eligibleRetirementYearKnown && !eligibleRetirementYear) ||
    !mentorshipStatus ||
    empty(execInterest) ||
    !execCoachingStatus
  );
}
