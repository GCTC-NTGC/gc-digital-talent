import type {
  ExecCoaching,
  Mentorship,
  OrganizationTypeInterest,
  TimeFrame,
} from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface RequiredFields {
  lateralMoveInterest?: boolean | null;
  promotionMoveInterest?: boolean | null;
  eligibleRetirementYearKnown?: boolean | null;
  eligibleRetirementYear?: string | null;
  mentorshipStatus?: LocalizedEnumValue<Mentorship>[] | null;
  execInterest?: boolean | null;
  execCoachingStatus?: LocalizedEnumValue<ExecCoaching>[] | null;
}

interface AllFields extends RequiredFields {
  lateralMoveTimeFrame?: LocalizedEnumValue<TimeFrame> | null;
  lateralMoveOrganizationType?:
    LocalizedEnumValue<OrganizationTypeInterest>[] | null;
  promotionMoveTimeFrame?: LocalizedEnumValue<TimeFrame> | null;
  promotionMoveOrganizationType?:
    LocalizedEnumValue<OrganizationTypeInterest>[] | null;
  mentorshipInterest?: LocalizedEnumValue<Mentorship>[] | null;
  execCoachingInterest?: LocalizedEnumValue<ExecCoaching>[] | null;
}

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
}: AllFields): boolean {
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
}: RequiredFields): boolean {
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
