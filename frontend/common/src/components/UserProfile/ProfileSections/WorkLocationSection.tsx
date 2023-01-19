import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import Well from "../../Well";
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
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {anyCriteriaSelected && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Work location:",
                  id: "b5bUa0",
                  description: "Work Location label, followed by colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">{regionPreferences}</span>
            </p>
          </div>
        )}
        {!!applicant.locationExemptions && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Location exemptions:",
                  id: "MoWNS4",
                  description: "Location Exemptions label, followed by colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {applicant.locationExemptions}
              </span>
            </p>
          </div>
        )}
        {!anyCriteriaSelected && editPath && (
          <>
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage: "You haven't added any information here yet.",
                  id: "SCCX7B",
                  description:
                    "Message for when no data exists for the section",
                })}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
                <a href={editPath}>
                  {intl.formatMessage({
                    defaultMessage: "Edit your work location options.",
                    id: "F3/88e",
                    description: "Link text to edit work location on profile",
                  })}
                </a>
              </p>
            </div>
          </>
        )}
        {!anyCriteriaSelected && !editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "No information has been provided.",
                id: "1VFyrc",
                description:
                  "Message on Admin side when user not filled WorkLocation section.",
              })}
            </p>
          </div>
        )}
      </div>
    </Well>
  );
};

export default WorkLocationSection;
