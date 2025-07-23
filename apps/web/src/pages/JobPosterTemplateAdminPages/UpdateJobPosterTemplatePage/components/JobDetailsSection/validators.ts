import { UpdateJobPosterTemplateJobDetailsFragment } from "@gc-digital-talent/graphql";

export const hasAllEmptyFields = ({
  name,
  description,
  supervisoryStatus,
  workStream,
  workDescription,
  keywords,
  classification,
  referenceId,
}: UpdateJobPosterTemplateJobDetailsFragment): boolean =>
  !name?.en &&
  !name?.fr &&
  !description?.en &&
  !description?.fr &&
  !supervisoryStatus?.value &&
  !workStream?.id &&
  !workDescription?.en &&
  !workDescription?.fr &&
  !keywords?.en &&
  !keywords?.fr &&
  !classification?.id &&
  !referenceId;

export const hasEmptyRequiredFields = ({
  name,
  description,
  supervisoryStatus,
  workStream,
  classification,
  referenceId,
}: UpdateJobPosterTemplateJobDetailsFragment): boolean =>
  !name?.en ||
  !name?.fr ||
  !description?.en ||
  !description?.fr ||
  !supervisoryStatus?.value ||
  !workStream?.id ||
  !classification?.id ||
  !referenceId;
