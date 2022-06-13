import React from "react";
import { useIntl } from "react-intl";

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

// styling a text bit with red colour within intl
function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
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
      data-h2-background-color="b(light.dt-gray)"
      data-h2-padding="b(x1)"
      data-h2-radius="b(s)"
    >
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="s(row) b(column)"
        data-h2-justify-content="b(space-between)"
      >
        <div>
          {!!firstName && !!lastName && (
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
                {preferredLang ? getLanguage(preferredLang).defaultMessage : ""}
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
                  ? getProvinceOrTerritory(currentProvince).defaultMessage
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
          {intl.formatMessage(
            {
              defaultMessage:
                "There are <redText>required</redText> fields missing.",
              description:
                "Message that there are required fields missing. Please ignore things in <> tags.",
            },
            {
              redText,
            },
          )}{" "}
          <a href={editPath}>
            {intl.formatMessage({
              defaultMessage: "Click here to get started.",
              description: "Message to click on the words to begin something",
            })}
          </a>
        </p>
      )}
    </div>
  );
};

export default AboutSection;
