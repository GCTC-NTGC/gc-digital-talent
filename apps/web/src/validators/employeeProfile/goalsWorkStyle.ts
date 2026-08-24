interface GoalsWorkStyleFields {
  aboutYou?: string | null;
  learningGoals?: string | null;
  workStyle?: string | null;
}

export function hasAllEmptyFields({
  aboutYou,
  learningGoals,
  workStyle,
}: GoalsWorkStyleFields): boolean {
  return !aboutYou && !learningGoals && !workStyle;
}

export function hasAnyEmptyFields({
  aboutYou,
  learningGoals,
  workStyle,
}: GoalsWorkStyleFields): boolean {
  return !aboutYou || !learningGoals || !workStyle;
}

export function hasEmptyRequiredFields(_: unknown): boolean {
  // no required fields
  return false;
}
