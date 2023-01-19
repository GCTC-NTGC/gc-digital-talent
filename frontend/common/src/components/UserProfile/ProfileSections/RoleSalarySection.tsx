import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import Well from "../../Well";
import messages from "../../../messages/commonMessages";
import { getGenericJobTitles } from "../../../constants/localizedConstants";
import { Applicant } from "../../../api/generated";

const RoleSalarySection: React.FunctionComponent<{
  applicant: Pick<Applicant, "expectedGenericJobTitles">;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
  const { expectedGenericJobTitles } = applicant;
  const expectedClassificationArray = expectedGenericJobTitles
    ? expectedGenericJobTitles.map((es) => (
        <li data-h2-font-weight="base(700)" key={es?.key}>
          {es ? intl.formatMessage(getGenericJobTitles(es.key)) : ""}
        </li>
      ))
    : null;

  const anyCriteriaSelected = !isEmpty(expectedClassificationArray);

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {anyCriteriaSelected && (
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
        {!anyCriteriaSelected && !editPath && (
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
