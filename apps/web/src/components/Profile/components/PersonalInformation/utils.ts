import { IntlShape } from "react-intl";

import { emptyToNull } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  UpdateUserAsUserInput,
  User,
  UserProfileFragment as UserProfileFragmentType,
} from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";

import { FormValues } from "./types";

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
  telephone: intl.formatMessage(commonMessages.telephone),
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
  email: intl.formatMessage(commonMessages.email),
  citizenship: intl.formatMessage({
    defaultMessage: "Citizenship status",
    id: "7DUfu+",
    description: "Legend text for citizenship status",
  }),
  armedForcesStatus: intl.formatMessage(profileMessages.veteranStatus),
});

export const dataToFormValues = (
  data?: UserProfileFragmentType | null,
): FormValues => ({
  preferredLang: data?.preferredLang?.value,
  preferredLanguageForInterview: data?.preferredLanguageForInterview?.value,
  preferredLanguageForExam: data?.preferredLanguageForExam?.value,
  telephone: data?.telephone,
  firstName: data?.firstName,
  lastName: data?.lastName,
  email: data?.email,
  citizenship: data?.citizenship?.value,
  armedForcesStatus: data?.armedForcesStatus?.value,
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
