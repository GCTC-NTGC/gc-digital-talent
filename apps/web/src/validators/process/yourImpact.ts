import type { LocalizedString } from "@gc-digital-talent/graphql";

interface YourImpactFields {
  yourImpact?: LocalizedString | null;
}

export function hasAllEmptyFields({ yourImpact }: YourImpactFields): boolean {
  return !!(!yourImpact?.en && !yourImpact?.fr);
}

export function hasEmptyRequiredFields({
  yourImpact,
}: YourImpactFields): boolean {
  return !!(!yourImpact?.en || !yourImpact?.fr);
}
