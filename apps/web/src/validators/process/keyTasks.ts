import type { LocalizedString } from "@gc-digital-talent/graphql";

interface KeyTasksFields {
  keyTasks?: LocalizedString | null;
}

export function hasAllEmptyFields({ keyTasks }: KeyTasksFields): boolean {
  return !!(!keyTasks?.en && !keyTasks?.fr);
}

export function hasEmptyRequiredFields({ keyTasks }: KeyTasksFields): boolean {
  return !!(!keyTasks?.en || !keyTasks?.fr);
}
