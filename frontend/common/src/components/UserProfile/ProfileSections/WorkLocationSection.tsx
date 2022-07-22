import React from "react";
import { useIntl } from "react-intl";
import { isEmpty } from "lodash";
import {
  getWorkRegion,
  requiredFieldsMissing,
} from "../../../constants/localizedConstants";
import { insertBetween } from "../../../helpers/util";

import { Applicant } from "../../../api/generated";

const WorkLocationSection: React.FunctionComponent<{
  applicant: Pick<Applicant, "locationPreferences" | "locationExemptions">;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
  // generate array of location preferences localized and formatted with spaces/commas
  const regionPreferencesSquished = applicant.locationPreferences?.map(
    (region) => (region ? intl.formatMessage(getWorkRegion(region)) : ""),
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";

  const anyCriteriaSelected = !isEmpty(regionPreferences);
  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {anyCriteriaSelected && (
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
      {!anyCriteriaSelected && editPath && (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              description: "Message for when no data exists for the section",
            })}
          </p>
          <p>
            {intl.formatMessage(requiredFieldsMissing)}{" "}
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Edit your work location options.",
                description: "Link text to edit work location on profile",
              })}
            </a>
          </p>
        </>
      )}

      {!anyCriteriaSelected && !editPath && (
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
