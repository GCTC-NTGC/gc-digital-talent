import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({ yourImpact }: Pool): boolean {
  return !!(!yourImpact?.en && !yourImpact?.fr);
}

export function hasEmptyRequiredFields({
  yourImpact,
}: Pick<Pool, "yourImpact">): boolean {
  return !!(!yourImpact?.en || !yourImpact?.fr);
}
