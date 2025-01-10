import { EmployeeProfile } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  aboutYou,
  careerGoals,
  learningGoals,
  workStyle,
}: Pick<
  EmployeeProfile,
  "aboutYou" | "careerGoals" | "learningGoals" | "workStyle"
>): boolean {
  return !aboutYou && !careerGoals && !learningGoals && !workStyle;
}

export function hasAnyEmptyFields({
  aboutYou,
  careerGoals,
  learningGoals,
  workStyle,
}: Pick<
  EmployeeProfile,
  "aboutYou" | "careerGoals" | "learningGoals" | "workStyle"
>): boolean {
  return !aboutYou || !careerGoals || !learningGoals || !workStyle;
}
