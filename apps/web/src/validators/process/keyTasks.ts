import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({ keyTasks }: Pool): boolean {
  return !!(!keyTasks?.en && !keyTasks?.fr);
}

export function hasEmptyRequiredFields({ keyTasks }: Pool): boolean {
  return !!(!keyTasks?.en || !keyTasks?.fr);
}
