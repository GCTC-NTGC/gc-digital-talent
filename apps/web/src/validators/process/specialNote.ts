import { Pool } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export function hasAllEmptyFields({
  specialNote,
}: Pick<Pool, "specialNote">): boolean {
  return !!(!specialNote?.en && !specialNote?.fr);
}
