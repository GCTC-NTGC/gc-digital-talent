import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Well } from "@gc-digital-talent/ui";
import { commonMessages, getWorkRegion } from "@gc-digital-talent/i18n";
import { insertBetween } from "@gc-digital-talent/helpers";

import { Applicant } from "~/api/generated";

type PartialApplicant = Pick<
  Applicant,
  "locationPreferences" | "locationExemptions"
>;

function anyCriteriaSelected(applicant: PartialApplicant): boolean {
  return !isEmpty(applicant.locationPreferences);
}

export function hasAllEmptyFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyRequiredFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  return !applicant.locationExemptions;
}

const WorkLocationSection = ({
  applicant,
  editPath,
}: {
  applicant: PartialApplicant;
  editPath?: string;
}) => {
  const intl = useIntl();
  // generate array of location preferences localized and formatted with spaces/commas
  const regionPreferencesSquished = applicant.locationPreferences?.map(
    (region) => (region ? intl.formatMessage(getWorkRegion(region)) : ""),
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {anyCriteriaSelected(applicant) && (
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
        {hasEmptyRequiredFields(applicant) && editPath && (
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
                {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
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
        {hasAllEmptyFields(applicant) && !editPath && (
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
