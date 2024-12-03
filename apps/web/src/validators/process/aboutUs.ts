import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({ aboutUs }: Pick<Pool, "aboutUs">): boolean {
  return !!(!aboutUs?.en && !aboutUs?.fr);
}

export function hasOneEmptyField({ aboutUs }: Pick<Pool, "aboutUs">): boolean {
  return !!(aboutUs?.en && !aboutUs?.fr) || !!(aboutUs?.fr && !aboutUs.en);
}
