import type { LocalizedString } from "@gc-digital-talent/graphql";

interface SpecialNoteFields {
  specialNote?: LocalizedString | null;
}

export function hasAllEmptyFields({ specialNote }: SpecialNoteFields): boolean {
  return !!(!specialNote?.en && !specialNote?.fr);
}
