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
    !!execInterest !== execInterest &&
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
  return (
    !mentorshipStatus || !!execInterest !== execInterest || !execCoachingStatus
  );
}
