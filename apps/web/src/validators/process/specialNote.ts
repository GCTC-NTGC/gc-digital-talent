import { Pool } from "~/api/generated";

export function hasAllEmptyFields({ specialNote }: Pool): boolean {
  return !!(!specialNote?.en && !specialNote?.fr);
}

export function hasEmptyRequiredFields({ specialNote }: Pool): boolean {
  return !!(!specialNote?.en || !specialNote?.fr);
}
