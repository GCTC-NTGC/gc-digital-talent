import { IntlShape } from "react-intl";

import { emptyToNull } from "@gc-digital-talent/helpers";

import {
  ArmedForcesStatus,
  CitizenshipStatus,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";
import { FormValues } from "./types";

export const getLabels = (intl: IntlShape) => ({
  preferredLang: intl.formatMessage({
    defaultMessage: "Select your preferred communication language",
    id: "MyUazW",
    description:
      "Legend text for required communication language preference in About Me form",
  }),
  preferredLanguageForInterview: intl.formatMessage({
    defaultMessage: "Select your preferred spoken interview language",
    id: "sOmEaW",
    description:
      "Legend text for required spoken interview language preference for interviews in About Me form",
  }),
  preferredLanguageForExam: intl.formatMessage({
    defaultMessage: "Select your preferred written exam language",
    id: "g5pT17",
    description:
      "Legend text for required written exam language preference for exams in About Me form",
  }),
  currentProvince: intl.formatMessage({
    defaultMessage: "Current province or territory",
    id: "r4PFx0",
    description:
      "Label for current province or territory field in About Me form",
  }),
  currentCity: intl.formatMessage({
    defaultMessage: "Current city",
    id: "de/Vcy",
    description: "Label for current city field in About Me form",
  }),
  telephone: intl.formatMessage({
    defaultMessage: "Telephone",
    id: "gBWsuB",
    description: "Label for telephone field in About Me form",
  }),
  firstName: intl.formatMessage({
    defaultMessage: "First Name",
    id: "btydLe",
    description: "Label for first name field in About Me form",
  }),
  lastName: intl.formatMessage({
    defaultMessage: "Last Name",
    id: "wrHSMx",
    description: "Label for last name field in About Me form",
  }),
  email: intl.formatMessage({
    defaultMessage: "Email",
    id: "i5xxbe",
    description: "Label for email field in About Me form",
  }),
  citizenship: intl.formatMessage({
    defaultMessage: "Citizenship Status",
    id: "o5pks7",
    description: "Legend text for required citizenship status in About Me form",
  }),
  armedForcesStatus: intl.formatMessage({
    defaultMessage: "Member of the Canadian Armed Forces (CAF)",
    id: "DZwVvi",
    description:
      "Legend text for required Canadian Armed Forces selection in About Me form",
  }),
});

export const initialDataToFormValues = (data?: User | null): FormValues => ({
  preferredLang: data?.preferredLang,
  preferredLanguageForInterview: data?.preferredLanguageForInterview,
  preferredLanguageForExam: data?.preferredLanguageForExam,
  currentProvince: data?.currentProvince,
  currentCity: data?.currentCity,
  telephone: data?.telephone,
  firstName: data?.firstName,
  lastName: data?.lastName,
  email: data?.email,
  citizenship: data?.citizenship,
  armedForcesStatus: data?.armedForcesStatus,
});

export const formValuesToSubmitData = (
  data: FormValues,
  initialUser: User,
): UpdateUserAsUserInput => {
  return {
    ...data,
    id: initialUser.id,
    email: emptyToNull(data.email),
  };
};

export const citizenshipStatusesOrdered = [
  CitizenshipStatus.Citizen,
  CitizenshipStatus.PermanentResident,
  CitizenshipStatus.Other,
];

export const armedForcesStatusOrdered = [
  ArmedForcesStatus.NonCaf,
  ArmedForcesStatus.Member,
  ArmedForcesStatus.Veteran,
];
