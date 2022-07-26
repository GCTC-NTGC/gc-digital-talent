import React from "react";
import { useIntl } from "react-intl";
import { isEmpty } from "lodash";
import messages from "../../../messages/commonMessages";
import { getWorkRegion } from "../../../constants/localizedConstants";
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
      data-h2-background-color="base(light.dt-gray)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
        {anyCriteriaSelected && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Work location:",
                description: "Work Location label, followed by colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">{regionPreferences}</span>
            </p>
          </div>
        )}
        {!!applicant.locationExemptions && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Location exemptions:",
                description: "Location Exemptions label, followed by colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {applicant.locationExemptions}
              </span>
            </p>
          </div>
        )}
        {!anyCriteriaSelected && editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                description: "Message for when no data exists for the section",
              })}
            </p>
            <p>
              {intl.formatMessage(messages.requiredFieldsMissing)}
              <br />
              <a href={editPath}>
                {intl.formatMessage({
                  defaultMessage: "Edit your work location options.",
                  description: "Link text to edit work location on profile",
                })}
              </a>
            </p>
          </div>
        )}

        {!anyCriteriaSelected && !editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "No information has been provided.",
                description:
                  "Message on Admin side when user not filled WorkLocation section.",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkLocationSection;
