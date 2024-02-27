import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({ specialNote }: Pool): boolean {
  return !!(!specialNote?.en && !specialNote?.fr);
}

export function hasEmptyRequiredFields({ specialNote }: Pool): boolean {
  return !!(!specialNote?.en || !specialNote?.fr);
}
