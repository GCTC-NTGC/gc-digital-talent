import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Well } from "@gc-digital-talent/ui";
import { commonMessages, getGenericJobTitles } from "@gc-digital-talent/i18n";

import { Applicant } from "~/api/generated";

type PartialApplicant = Pick<Applicant, "expectedGenericJobTitles">;

function anyCriteriaSelected({ expectedGenericJobTitles }: PartialApplicant) {
  return !isEmpty(expectedGenericJobTitles);
}

export function hasAllEmptyFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyRequiredFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  // no optional fields
  return false;
}

const RoleSalarySection = ({
  applicant,
  editPath,
}: {
  applicant: Pick<Applicant, "expectedGenericJobTitles">;
  editPath?: string;
}) => {
  const intl = useIntl();
  const { expectedGenericJobTitles } = applicant;
  const expectedClassificationArray = expectedGenericJobTitles
    ? expectedGenericJobTitles.map((es) => (
        <li data-h2-font-weight="base(700)" key={es?.key}>
          {es ? intl.formatMessage(getGenericJobTitles(es.key)) : ""}
        </li>
      ))
    : null;

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {anyCriteriaSelected(applicant) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would like to be referred for jobs at the following levels:",
                id: "e2Rfn/",
                description: "Label for Role and salary expectations sections",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {expectedClassificationArray}
            </ul>
          </div>
        )}
        {hasAllEmptyFields(applicant) && editPath && (
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
                    defaultMessage:
                      "Edit your role and salary expectation options.",
                    id: "BPiMTY",
                    description:
                      "Link text to edit role and salary expectations on profile.",
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
                id: "kjX7mF",
                description:
                  "Message on Admin side when user not filled RoleSalary section.",
              })}
            </p>
          </div>
        )}
      </div>
    </Well>
  );
};

export default RoleSalarySection;
