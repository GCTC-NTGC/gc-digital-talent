import { getLanguage } from "@common/constants";
import { getProvinceOrTerritory } from "@common/constants/localizedConstants";
import React from "react";
import { useIntl } from "react-intl";
import { Applicant } from "../../../api/generated";

// styling a text bit with red colour within intls
function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

const AboutMeSection: React.FunctionComponent<{
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
  editPath: string;
}> = ({ applicant, editPath }) => {
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
          {!!applicant.firstName && !!applicant.lastName && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Name:",
                description: "Name label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">
                {applicant.firstName} {applicant.lastName}
              </span>
            </p>
          )}
          {!!applicant.email && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Email:",
                description: "Email label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">{applicant.email}</span>
            </p>
          )}
          {!!applicant.telephone && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Phone:",
                description: "Phone label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">{applicant.telephone}</span>
            </p>
          )}
        </div>
        <div>
          {!!applicant.preferredLang && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Preferred Communication Language:",
                description:
                  "Preferred Language for communication purposes label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">
                {applicant.preferredLang
                  ? getLanguage(applicant.preferredLang).defaultMessage
                  : ""}
              </span>
            </p>
          )}
          {!!applicant.currentCity && !!applicant.currentProvince && (
            <p>
              {intl.formatMessage({
                defaultMessage: "Current Location:",
                description: "Current Location label and colon",
              })}{" "}
              <span data-h2-font-weight="b(700)">
                {applicant.currentCity},{" "}
                {applicant.currentProvince
                  ? getProvinceOrTerritory(applicant.currentProvince)
                      .defaultMessage
                  : ""}
              </span>
            </p>
          )}
        </div>
      </div>
      {!applicant.firstName &&
        !applicant.lastName &&
        !applicant.email &&
        !applicant.telephone &&
        !applicant.preferredLang &&
        !applicant.currentCity &&
        !applicant.currentProvince && (
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              description: "Message for when no data exists for the section",
            })}
          </p>
        )}
      {(!applicant.firstName ||
        !applicant.lastName ||
        !applicant.email ||
        !applicant.telephone ||
        !applicant.preferredLang ||
        !applicant.currentCity ||
        !applicant.currentProvince) && (
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

export default AboutMeSection;
