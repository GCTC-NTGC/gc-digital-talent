import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({ aboutUs }: Pool): boolean {
  return !!(!aboutUs?.en && !aboutUs?.fr);
}

export function hasOneEmptyField({ aboutUs }: Pool): boolean {
  return !!(aboutUs?.en && !aboutUs?.fr) || !!(aboutUs?.fr && !aboutUs.en);
}
