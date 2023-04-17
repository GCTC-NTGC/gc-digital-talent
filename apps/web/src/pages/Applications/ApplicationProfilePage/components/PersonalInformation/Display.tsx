import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";

import { empty } from "@gc-digital-talent/helpers";
import FieldDisplay from "../FieldDisplay";

interface DisplayProps {
  user: User;
}

const Display = ({
  user: {
    firstName,
    lastName,
    email,
    telephone,
    preferredLang,
    preferredLanguageForInterview,
    preferredLanguageForExam,
    currentCity,
    currentProvince,
    citizenship,
    armedForcesStatus,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))"
      data-h2-gap="base(x1)"
    >
      <FieldDisplay
        hasError={!firstName || !lastName}
        label={intl.formatMessage({
          defaultMessage: "Name",
          id: "gOkIvb",
          description: "Name label",
        })}
      >
        {firstName || lastName
          ? getFullNameHtml(firstName, lastName, intl)
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!email}
        label={intl.formatMessage({
          defaultMessage: "Email",
          id: "DuPnGd",
          description: "Email label",
        })}
      >
        {email || notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!telephone}
        label={intl.formatMessage({
          defaultMessage: "Telephone",
          id: "bCtIa8",
          description: "Telephone label",
        })}
      >
        {telephone ? (
          <a
            href={`tel:${telephone}`}
            aria-label={telephone.replace(/.{1}/g, "$& ")}
          >
            {telephone}
          </a>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLang}
        label={intl.formatMessage({
          defaultMessage: "General communication",
          id: "EfvPEG",
          description: "General communication preference label",
        })}
      >
        {preferredLang
          ? intl.formatMessage(getLanguage(preferredLang))
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLanguageForInterview}
        label={intl.formatMessage({
          defaultMessage: "Spoken interviews",
          id: "wajUxx",
          description: "Spoken interviews language preference label",
        })}
      >
        {preferredLanguageForInterview
          ? intl.formatMessage(getLanguage(preferredLanguageForInterview))
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLanguageForExam}
        label={intl.formatMessage({
          defaultMessage: "Written exams",
          id: "LkYvx3",
          description: "Written exams language preference label",
        })}
      >
        {preferredLanguageForExam
          ? intl.formatMessage(getLanguage(preferredLanguageForExam))
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!currentCity || !currentProvince}
        label={intl.formatMessage({
          defaultMessage: "Current location",
          id: "MAz7iU",
          description: "Current location label",
        })}
      >
        {currentCity || currentProvince
          ? `${currentCity}, ${
              currentProvince
                ? intl.formatMessage(getProvinceOrTerritory(currentProvince))
                : null
            }`
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={empty(armedForcesStatus)}
        label={intl.formatMessage({
          defaultMessage: "Veteran status",
          id: "k28EAQ",
          description: "Veteran status label",
        })}
      >
        {armedForcesStatus !== null && armedForcesStatus !== undefined
          ? intl.formatMessage(getArmedForcesStatusesProfile(armedForcesStatus))
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!citizenship}
        label={intl.formatMessage({
          defaultMessage: "Citizenship status",
          id: "4v9y7U",
          description: "Citizenship status label",
        })}
      >
        {citizenship
          ? intl.formatMessage(getCitizenshipStatusesProfile(citizenship))
          : notProvided}
      </FieldDisplay>
    </div>
  );
};

export default Display;
