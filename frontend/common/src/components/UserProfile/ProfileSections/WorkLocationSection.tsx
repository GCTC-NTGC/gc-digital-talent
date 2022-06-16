import React from "react";
import { useIntl } from "react-intl";
import { getWorkRegion } from "../../../constants/localizedConstants";
import { insertBetween } from "../../../helpers/util";

import { Applicant } from "../../../api/generated";

// styling a text bit with red colour within intls
function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

const WorkLocationSection: React.FunctionComponent<{
  applicant: Pick<Applicant, "locationPreferences" | "locationExemptions">;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
  // generate array of location preferences localized and formatted with spaces/commas
  const regionPreferencesSquished = applicant.locationPreferences?.map(
    (region) => (region ? getWorkRegion(region).defaultMessage : ""),
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";
  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {!!applicant.locationPreferences &&
        !!applicant.locationPreferences.length && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Work location:",
              description: "Work Location label, followed by colon",
            })}{" "}
            <span data-h2-font-weight="b(700)">{regionPreferences}</span>
          </p>
        )}
      {!!applicant.locationExemptions && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Location exemptions:",
            description: "Location Exemptions label, followed by colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {applicant.locationExemptions}
          </span>
        </p>
      )}
      {!applicant.locationPreferences &&
        !applicant.locationExemptions &&
        editPath && (
          <>
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                description: "Message for when no data exists for the section",
              })}
            </p>
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
                  description:
                    "Message to click on the words to begin something",
                })}
              </a>
            </p>
          </>
        )}

      {(!applicant.locationPreferences ||
        !applicant.locationPreferences.length) &&
        !editPath && (
          <p>
            {intl.formatMessage({
              defaultMessage: "No information has been provided.",
              description:
                "Message on Admin side when user not filled WorkLocation section.",
            })}
          </p>
        )}
    </div>
  );
};

export default WorkLocationSection;
