import React from "react";
import { useIntl } from "react-intl";

import messages from "../../../messages/commonMessages";
import { getProvinceOrTerritory } from "../../../constants/localizedConstants";
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
  },
}) => {
  const intl = useIntl();
  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="s(row) b(column)"
        data-h2-justify-content="b(space-between)"
      >
        <div>
          {(!!firstName || !!lastName) && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Name:",
                description: "Name label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">
                {firstName} {lastName}
              </span>
            </p>
          )}
          {!!email && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Email:",
                description: "Email label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">{email}</span>
            </p>
          )}
          {!!telephone && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Phone:",
                description: "Phone label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">{telephone}</span>
            </p>
          )}
        </div>
        <div>
          {!!preferredLang && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Preferred Communication Language:",
                description:
                  "Preferred Language for communication purposes label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">
                {preferredLang
                  ? intl.formatMessage(getLanguage(preferredLang))
                  : ""}
              </span>
            </p>
          )}
          {!!currentCity && !!currentProvince && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Current Location:",
                description: "Current Location label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">
                {currentCity},{" "}
                {currentProvince
                  ? intl.formatMessage(getProvinceOrTerritory(currentProvince))
                  : ""}
              </span>
            </p>
          )}
        </div>
      </div>
      {!firstName &&
        !lastName &&
        !email &&
        !telephone &&
        !preferredLang &&
        !currentCity &&
        !currentProvince && (
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              description: "Message for when no data exists for the section",
            })}
          </p>
        )}
      {(!firstName ||
        !lastName ||
        !email ||
        !telephone ||
        !preferredLang ||
        !currentCity ||
        !currentProvince) && (
        <p>
          {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
          <a href={editPath}>
            {intl.formatMessage({
              defaultMessage: "Edit your about me options.",
              description: "Link text to edit about me section on profile.",
            })}
          </a>
        </p>
      )}
    </div>
  );
};

export default AboutSection;
