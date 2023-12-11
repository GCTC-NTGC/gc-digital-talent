import { Pool } from "~/api/generated";

export function hasAllEmptyFields({ yourImpact }: Pool): boolean {
  return !!(!yourImpact?.en && !yourImpact?.fr);
}

export function hasEmptyRequiredFields({ yourImpact }: Pool): boolean {
  return !!(!yourImpact?.en || !yourImpact?.fr);
}
