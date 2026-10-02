import type { LocalizedString } from "@gc-digital-talent/graphql";

interface AboutUsFields {
  aboutUs?: LocalizedString | null;
}

export function hasAllEmptyFields({ aboutUs }: AboutUsFields): boolean {
  return !!(!aboutUs?.en && !aboutUs?.fr);
}

export function hasOneEmptyField({ aboutUs }: AboutUsFields): boolean {
  return !!(aboutUs?.en && !aboutUs?.fr) || !!(aboutUs?.fr && !aboutUs.en);
}
