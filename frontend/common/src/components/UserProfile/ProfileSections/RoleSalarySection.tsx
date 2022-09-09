import React from "react";
import { useIntl } from "react-intl";
import { isEmpty } from "lodash";
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
    <div id="role-and-salary-expectations">
      <div
        data-h2-background-color="base(light.dt-gray)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(s)"
      >
        <div data-h2-flex-grid="base(flex-start, x2, x1)">
          {anyCriteriaSelected && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be referred for jobs at the following levels:",
                  description:
                    "Label for Role and salary expectations sections",
                })}
              </p>
              <ul data-h2-padding="base(0, 0, 0, x2)">
                {expectedClassificationArray}
              </ul>
            </div>
          )}
          {!anyCriteriaSelected && editPath && (
            <div data-h2-flex-item="base(1of1)">
              <p data-h2-color="base(dt-gray.dark)">
                {intl.formatMessage({
                  defaultMessage: "You haven't added any information here yet.",
                  description:
                    "Message for when no data exists for the section",
                })}
              </p>
            </div>
          )}
          {!anyCriteriaSelected && editPath && (
            <div data-h2-flex-item="base(1of1)">
              <p data-h2-color="base(dt-gray.dark)">
                {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
                <a href={editPath}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Edit your role and salary expectation options.",
                    description:
                      "Link text to edit role and salary expectations on profile.",
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
                    "Message on Admin side when user not filled RoleSalary section.",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSalarySection;
