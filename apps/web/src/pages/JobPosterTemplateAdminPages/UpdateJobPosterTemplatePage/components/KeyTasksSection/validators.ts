import { UpdateJobPosterTemplateKeyTasksFragment } from "@gc-digital-talent/graphql";

export const hasAllEmptyFields = ({
  tasks,
}: UpdateJobPosterTemplateKeyTasksFragment): boolean =>
  !tasks?.en && !tasks?.fr;

export const hasEmptyRequiredFields = ({
  tasks,
}: UpdateJobPosterTemplateKeyTasksFragment): boolean =>
  !tasks?.en || !tasks?.fr;
