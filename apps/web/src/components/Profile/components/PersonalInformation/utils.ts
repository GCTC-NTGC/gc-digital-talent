import { IntlShape } from "react-intl";

import { emptyToNull } from "@gc-digital-talent/helpers";

import {
  ArmedForcesStatus,
  CitizenshipStatus,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";

import { FormValues, PartialUser } from "./types";

export const getLabels = (intl: IntlShape) => ({
  preferredLang: intl.formatMessage({
    defaultMessage: "Communication language",
    id: "ceofev",
    description: "Legend text for communication language preference",
  }),
  preferredLanguageForInterview: intl.formatMessage({
    defaultMessage: "Spoken interview language",
    id: "ehrsDa",
    description:
      "Legend text for spoken interview language preference for interviews",
  }),
  preferredLanguageForExam: intl.formatMessage({
    defaultMessage: "Written exam language",
    id: "boPmF+",
    description: "Legend text for written exam language preference for exams",
  }),
  currentProvince: intl.formatMessage({
    defaultMessage: "Province or territory",
    id: "yzgwjd",
    description: "Label for current province or territory field",
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
    defaultMessage: "Given name",
    id: "DUh8zg",
    description: "Label for given name field",
  }),
  lastName: intl.formatMessage({
    defaultMessage: "Surname",
    id: "dssZUt",
    description: "Label for surname field",
  }),
  email: intl.formatMessage({
    defaultMessage: "Personal email",
    id: "g1++nq",
    description: "Label for email field",
  }),
  citizenship: intl.formatMessage({
    defaultMessage: "Citizenship status",
    id: "7DUfu+",
    description: "Legend text for citizenship status",
  }),
  armedForcesStatus: intl.formatMessage({
    defaultMessage: "Veteran status",
    id: "WyejQ2",
    description: "Legend text for Veteran status selection",
  }),
});

export const dataToFormValues = (data?: PartialUser | null): FormValues => ({
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
  initialUser: Pick<User, "id">,
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
