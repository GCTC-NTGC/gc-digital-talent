import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  keyTasks,
}: Pick<Pool, "keyTasks">): boolean {
  return !!(!keyTasks?.en && !keyTasks?.fr);
}

export function hasEmptyRequiredFields({
  keyTasks,
}: Pick<Pool, "keyTasks">): boolean {
  return !!(!keyTasks?.en || !keyTasks?.fr);
}
