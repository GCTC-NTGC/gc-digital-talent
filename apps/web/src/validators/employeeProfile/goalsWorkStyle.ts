import { EmployeeProfile } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  aboutYou,
  learningGoals,
  workStyle,
}: Pick<EmployeeProfile, "aboutYou" | "learningGoals" | "workStyle">): boolean {
  return !aboutYou && !learningGoals && !workStyle;
}

export function hasAnyEmptyFields({
  aboutYou,
  learningGoals,
  workStyle,
}: Pick<EmployeeProfile, "aboutYou" | "learningGoals" | "workStyle">): boolean {
  return !aboutYou || !learningGoals || !workStyle;
}
