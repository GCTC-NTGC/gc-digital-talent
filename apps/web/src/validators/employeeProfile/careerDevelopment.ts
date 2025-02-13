import { EmployeeProfile } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

export function hasAllEmptyFields({
  organizationTypeInterest,
  moveInterest,
  mentorshipStatus,
  mentorshipInterest,
  execInterest,
  execCoachingStatus,
  execCoachingInterest,
}: Pick<
  EmployeeProfile,
  | "organizationTypeInterest"
  | "moveInterest"
  | "mentorshipStatus"
  | "mentorshipInterest"
  | "execInterest"
  | "execCoachingInterest"
  | "execCoachingStatus"
>): boolean {
  return (
    !organizationTypeInterest &&
    !moveInterest &&
    !mentorshipStatus &&
    !mentorshipInterest &&
    empty(execInterest) &&
    !execCoachingStatus &&
    !execCoachingInterest
  );
}

export function hasAnyEmptyFields({
  mentorshipStatus,
  execInterest,
  execCoachingStatus,
}: Pick<
  EmployeeProfile,
  "mentorshipStatus" | "execInterest" | "execCoachingStatus"
>): boolean {
  return !mentorshipStatus || empty(execInterest) || !execCoachingStatus;
}
