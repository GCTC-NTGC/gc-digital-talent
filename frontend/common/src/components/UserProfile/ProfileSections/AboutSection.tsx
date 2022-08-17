import React from "react";
import { useIntl } from "react-intl";

import messages from "../../../messages/commonMessages";
import {
  getProvinceOrTerritory,
  getCitizenshipStatusesProfile,
} from "../../../constants/localizedConstants";
import { getLanguage } from "../../../constants";
import type { Applicant } from "../../../api/generated";

interface AboutSectionProps {
  applicant: Pick<
    Applicant,
    | "firstName"
    | "lastName"
    | "email"
    | "telephone"
    | "preferredLang"
    | "currentCity"
    | "currentProvince"
    | "citizenship"
    | "isVeteran"
  >;
  editPath?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  editPath,
  applicant: {
    firstName,
    lastName,
    telephone,
    email,
    preferredLang,
    currentCity,
    currentProvince,
    citizenship,
    isVeteran,
  },
}) => {
  const intl = useIntl();
  return (
    <div
      data-h2-background-color="base(light.dt-gray)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
        {(!!firstName || !!lastName) && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Name:",
                description: "Name label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {firstName} {lastName}
              </span>
            </p>
          </div>
        )}
        {!!email && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Email:",
                description: "Email label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">{email}</span>
            </p>
          </div>
        )}
        {!!telephone && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Phone:",
                description: "Phone label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">{telephone}</span>
            </p>
          </div>
        )}
        {!!preferredLang && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Preferred Communication Language:",
                description:
                  "Preferred Language for communication purposes label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {preferredLang
                  ? intl.formatMessage(getLanguage(preferredLang))
                  : ""}
              </span>
            </p>
          </div>
        )}
        {!!currentCity && !!currentProvince && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Current Location:",
                description: "Current Location label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {currentCity},{" "}
                {currentProvince
                  ? intl.formatMessage(getProvinceOrTerritory(currentProvince))
                  : ""}
              </span>
            </p>
          </div>
        )}
        {isVeteran !== null && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Member of CAF:",
                description: "Veteran/member label",
              })}{" "}
              <span data-h2-font-weight="base(700)">
                {isVeteran
                  ? intl.formatMessage({
                      defaultMessage: "I am a veteran or member of the CAF",
                      description: "Am member or veteran of the CAF",
                    })
                  : intl.formatMessage({
                      defaultMessage: "I am not a veteran or member of the CAF",
                      description: "Am not member or veteran of the CAF",
                    })}
              </span>
            </p>
          </div>
        )}
        {citizenship ? (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Citizenship Status:",
                description: "Citizenship status label",
              })}{" "}
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage(getCitizenshipStatusesProfile(citizenship))}
              </span>
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
      {!firstName &&
        !lastName &&
        !email &&
        !telephone &&
        !preferredLang &&
        !currentCity &&
        !currentProvince &&
        !citizenship &&
        isVeteran === null && (
          <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
            <div data-h2-flex-item="base(1of1)">
              <p data-h2-color="base(dt-gray.dark)">
                {intl.formatMessage({
                  defaultMessage: "You haven't added any information here yet.",
                  description:
                    "Message for when no data exists for the section",
                })}
              </p>
            </div>
          </div>
        )}
      {(!firstName ||
        !lastName ||
        !email ||
        !telephone ||
        !preferredLang ||
        !currentCity ||
        !currentProvince ||
        !citizenship ||
        isVeteran === null) && (
        <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
              <a href={editPath}>
                {intl.formatMessage({
                  defaultMessage: "Edit your about me options.",
                  description: "Link text to edit about me section on profile.",
                })}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutSection;
