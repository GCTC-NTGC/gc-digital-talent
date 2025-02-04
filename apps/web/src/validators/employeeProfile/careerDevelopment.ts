import { EmployeeProfile } from "@gc-digital-talent/graphql";

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
    !execInterest &&
    !execCoachingStatus &&
    !execCoachingInterest
  );
}

export function hasAnyEmptyFields({
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
    !organizationTypeInterest ||
    !moveInterest ||
    !mentorshipStatus ||
    !mentorshipInterest ||
    !execInterest ||
    !execCoachingStatus ||
    !execCoachingInterest
  );
}
