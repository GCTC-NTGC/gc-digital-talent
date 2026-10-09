interface PersonalFields {
  title?: string | null;
  startDate?: string | null;
  organization?: string | null;
  learningDescription?: string | null;
}

export function hasEmptyRequiredFields({
  title,
  startDate,
  organization,
  learningDescription,
}: PersonalFields): boolean {
  return !!(!title || !startDate || !organization || !learningDescription);
}
