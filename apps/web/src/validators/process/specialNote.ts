import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  specialNote,
}: Pick<Pool, "specialNote">): boolean {
  return !!(!specialNote?.en && !specialNote?.fr);
}
