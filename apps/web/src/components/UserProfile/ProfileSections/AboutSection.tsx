import React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getProvinceOrTerritory,
  getCitizenshipStatusesProfile,
  getArmedForcesStatusesProfile,
  getLanguage,
} from "@gc-digital-talent/i18n";

import { getFullNameHtml } from "~/utils/nameUtils";
import type { Applicant } from "~/api/generated";

type PartialApplicant = Pick<
  Applicant,
  | "firstName"
  | "lastName"
  | "email"
  | "telephone"
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "currentCity"
  | "currentProvince"
  | "citizenship"
  | "armedForcesStatus"
>;

interface AboutSectionProps {
  applicant: PartialApplicant;
  editPath?: string;
}

export function hasAllEmptyFields({
  firstName,
  lastName,
  telephone,
  email,
  preferredLang,
  currentCity,
  currentProvince,
  citizenship,
  armedForcesStatus,
}: PartialApplicant): boolean {
  return !!(
    !firstName &&
    !lastName &&
    !email &&
    !telephone &&
    !preferredLang &&
    !currentCity &&
    !currentProvince &&
    !citizenship &&
    armedForcesStatus === null
  );
}

export function hasEmptyRequiredFields({
  firstName,
  lastName,
  telephone,
  email,
  preferredLang,
  preferredLanguageForInterview,
  currentCity,
  currentProvince,
  citizenship,
  armedForcesStatus,
}: PartialApplicant): boolean {
  return (
    !firstName ||
    !lastName ||
    !email ||
    !telephone ||
    !preferredLang ||
    !preferredLanguageForInterview ||
    !preferredLanguageForInterview ||
    !currentCity ||
    !currentProvince ||
    !citizenship ||
    armedForcesStatus === null
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  // no optional fields
  return false;
}

const AboutSection: React.FC<AboutSectionProps> = ({ editPath, applicant }) => {
  const intl = useIntl();
  const {
    firstName,
    lastName,
    telephone,
    email,
    preferredLang,
    preferredLanguageForInterview,
    preferredLanguageForExam,
    currentCity,
    currentProvince,
    citizenship,
    armedForcesStatus,
  } = applicant;
  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {(!!firstName || !!lastName) && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Name:",
                  id: "DAmLhV",
                  description: "Name label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {getFullNameHtml(firstName, lastName, intl)}
              </span>
            </p>
          </div>
        )}
        {!!email && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Email:",
                  id: "mtFK6A",
                  description: "Email label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">{email}</span>
            </p>
          </div>
        )}
        {!!telephone && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Phone:",
                  id: "azOv8A",
                  description: "Phone label and colon",
                })}
              </span>
              {telephone ? (
                <a
                  href={`tel:${telephone}`}
                  aria-label={telephone.replace(/.{1}/g, "$& ")}
                >
                  <span data-h2-font-weight="base(700)">{telephone}</span>
                </a>
              ) : (
                ""
              )}
            </p>
          </div>
        )}
        {!!preferredLang && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Preferred Communication Language:",
                  id: "bEwwY/",
                  description:
                    "Preferred Language for communication purposes label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {preferredLang
                  ? intl.formatMessage(getLanguage(preferredLang))
                  : ""}
              </span>
            </p>
          </div>
        )}

        {!!preferredLanguageForInterview && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Preferred Spoken Interview Language:",
                id: "c7At4h",
                description:
                  "Preferred Language for interviews label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {preferredLanguageForInterview
                  ? intl.formatMessage(
                      getLanguage(preferredLanguageForInterview),
                    )
                  : ""}
              </span>
            </p>
          </div>
        )}

        {!!preferredLanguageForExam && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Preferred Written Exam Language:",
                id: "rSymh2",
                description: "Preferred Language for exams label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {preferredLanguageForExam
                  ? intl.formatMessage(getLanguage(preferredLanguageForExam))
                  : ""}
              </span>
            </p>
          </div>
        )}

        {!!currentCity && !!currentProvince && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Current Location:",
                  id: "s1h7Mc",
                  description: "Current Location label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {currentCity},{" "}
                {currentProvince
                  ? intl.formatMessage(getProvinceOrTerritory(currentProvince))
                  : ""}
              </span>
            </p>
          </div>
        )}
        {armedForcesStatus !== null && armedForcesStatus !== undefined && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Member of CAF:",
                  id: "Md/cQS",
                  description: "Veteran/member label",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage(
                  getArmedForcesStatusesProfile(armedForcesStatus),
                )}
              </span>
            </p>
          </div>
        )}
        {citizenship ? (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Citizenship Status:",
                  id: "92hwzj",
                  description: "Citizenship status label",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage(getCitizenshipStatusesProfile(citizenship))}
              </span>
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
      {hasEmptyRequiredFields(applicant) && (
        <div data-h2-margin="base(x1, 0, 0, 0)">
          <p>
            {editPath && (
              <>
                {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
                <a href={editPath}>
                  {intl.formatMessage({
                    defaultMessage: "Edit your about me options.",
                    id: "L9AGk7",
                    description:
                      "Link text to edit about me section on profile.",
                  })}
                </a>
              </>
            )}
            {!editPath && (
              <>
                {intl.formatMessage({
                  defaultMessage: "No information has been provided.",
                  id: "NIEIAC",
                  description:
                    "Message on Admin side when user not filled about me section.",
                })}
              </>
            )}
          </p>
        </div>
      )}
    </Well>
  );
};

export default AboutSection;
