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
        <li data-h2-font-weight="b(700)" key={es?.key}>
          {es ? intl.formatMessage(getGenericJobTitles(es.key)) : ""}
        </li>
      ))
    : null;

  const anyCriteriaSelected = !isEmpty(expectedClassificationArray);

  return (
    <div id="role-and-salary-expectations">
      <div
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(all, m)"
        data-h2-radius="b(s)"
      >
        {anyCriteriaSelected && (
          <>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would like to be referred for jobs at the following levels:",
                description: "Label for Role and salary expectations sections",
              })}
            </p>
            <ul data-h2-padding="b(left, l)">{expectedClassificationArray}</ul>
          </>
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
          </>
        )}
        {!anyCriteriaSelected && !editPath && (
          <p>
            {intl.formatMessage({
              defaultMessage: "No information has been provided.",
              description:
                "Message on Admin side when user not filled RoleSalary section.",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleSalarySection;
