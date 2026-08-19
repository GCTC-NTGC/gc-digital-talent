import { convertDateTimeZone } from "@gc-digital-talent/date-helpers";
import type {
  CreateSpecialApplicationInput,
  SpecialApplicationType,
} from "@gc-digital-talent/graphql";

export interface CreateSpecialApplicationDialogFormValues {
  pool: string;
  specialApplicationType: SpecialApplicationType;
  specialApplicationJustification: string;
  specialApplicationClosingDate: string;
}

export const createSpecialApplicationDialogFormValuesToSubmitData = (
  userId: string,
  values: CreateSpecialApplicationDialogFormValues,
): CreateSpecialApplicationInput => {
  // convert input to correct UTC time
  // matching ClosingDateSection.tsx
  const inputClosingDate = values.specialApplicationClosingDate;
  const inputClosingDateInUtc = convertDateTimeZone(
    `${inputClosingDate} 23:59:59`,
    "Canada/Pacific",
    "UTC",
  );

  return {
    pool: { connect: values.pool },
    user: { connect: userId },
    specialApplicationType: values.specialApplicationType,
    specialApplicationJustification: values.specialApplicationJustification,
    specialApplicationClosingDate: inputClosingDateInUtc,
  };
};
