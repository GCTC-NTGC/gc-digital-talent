import { Pool } from "~/api/generated";

export function hasAllEmptyFields({ keyTasks }: Pool): boolean {
  return !!(!keyTasks?.en && !keyTasks?.fr);
}

export function hasEmptyRequiredFields({ keyTasks }: Pool): boolean {
  return !!(!keyTasks?.en || !keyTasks?.fr);
}
