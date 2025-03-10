import { Pool } from "@gc-digital-talent/graphql";

// Note: Field is optional so we only validate for null state
export function hasAllEmptyFields({ whatToExpect }: Pool): boolean {
  return !!(!whatToExpect?.en && !whatToExpect?.fr);
}
