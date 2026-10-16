interface CommunityFields {
  title?: string | null;
  startDate?: string | null;
  organization?: string | null;
  project?: string | null;
  details?: string | null;
}

export function hasEmptyRequiredFields({
  title,
  startDate,
  organization,
  project,
  details,
}: CommunityFields): boolean {
  return !!(!title || !startDate || !organization || !project || !details);
}
