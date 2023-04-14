import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import {
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";

import ProfileLabel from "../ProfileLabel";

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

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))"
      data-h2-gap="base(x1)"
    >
      {(!!firstName || !!lastName) && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Name:",
              id: "DAmLhV",
              description: "Name label and colon",
            })}
          </ProfileLabel>
          <span>{getFullNameHtml(firstName, lastName, intl)}</span>
        </p>
      )}
      {!!email && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Email:",
              id: "mtFK6A",
              description: "Email label and colon",
            })}
          </ProfileLabel>
          <span>{email}</span>
        </p>
      )}
      {!!telephone && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Phone:",
              id: "azOv8A",
              description: "Phone label and colon",
            })}
          </ProfileLabel>
          {telephone ? (
            <a
              href={`tel:${telephone}`}
              aria-label={telephone.replace(/.{1}/g, "$& ")}
            >
              {telephone}
            </a>
          ) : null}
        </p>
      )}
      {!!preferredLang && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Preferred Communication Language:",
              id: "bEwwY/",
              description:
                "Preferred Language for communication purposes label and colon",
            })}
          </ProfileLabel>

          {preferredLang ? (
            <span>{intl.formatMessage(getLanguage(preferredLang))}</span>
          ) : null}
        </p>
      )}
      {!!preferredLanguageForInterview && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Preferred Spoken Interview Language:",
              id: "c7At4h",
              description: "Preferred Language for interviews label and colon",
            })}
          </ProfileLabel>
          {preferredLanguageForInterview ? (
            <span>
              {intl.formatMessage(getLanguage(preferredLanguageForInterview))}
            </span>
          ) : null}
        </p>
      )}
      {!!preferredLanguageForExam && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Preferred Written Exam Language:",
              id: "rSymh2",
              description: "Preferred Language for exams label and colon",
            })}
          </ProfileLabel>
          {preferredLanguageForExam ? (
            <span>
              {intl.formatMessage(getLanguage(preferredLanguageForExam))}
            </span>
          ) : null}
        </p>
      )}
      {!!currentCity && !!currentProvince && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Current Location:",
              id: "s1h7Mc",
              description: "Current Location label and colon",
            })}
          </ProfileLabel>
          <span>
            {currentCity},{" "}
            {currentProvince
              ? intl.formatMessage(getProvinceOrTerritory(currentProvince))
              : null}
          </span>
        </p>
      )}
      {armedForcesStatus !== null && armedForcesStatus !== undefined && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Member of CAF:",
              id: "Md/cQS",
              description: "Veteran/member label",
            })}
          </ProfileLabel>
          <span>
            {intl.formatMessage(
              getArmedForcesStatusesProfile(armedForcesStatus),
            )}
          </span>
        </p>
      )}
      {citizenship ? (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Citizenship Status:",
              id: "92hwzj",
              description: "Citizenship status label",
            })}
          </ProfileLabel>
          <span>
            {intl.formatMessage(getCitizenshipStatusesProfile(citizenship))}
          </span>
        </p>
      ) : null}
    </div>
  );
};

export default Display;
