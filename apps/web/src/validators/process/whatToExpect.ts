import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({ whatToExpect }: Pool): boolean {
  return !!(!whatToExpect?.en && !whatToExpect?.fr);
}

export function hasEmptyRequiredFields({ whatToExpect }: Pool): boolean {
  return !!(!whatToExpect?.en || !whatToExpect?.fr);
}
