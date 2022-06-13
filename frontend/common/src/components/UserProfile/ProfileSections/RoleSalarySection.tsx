import React from "react";
import { useIntl } from "react-intl";
import { getClassificationRoles } from "../../../constants/localizedConstants";
import { Applicant } from "../../../api/generated";

const RoleSalarySection: React.FunctionComponent<{
  applicant: Pick<Applicant, "expectedClassificationRoles">;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
  const { expectedClassificationRoles } = applicant;
  // generate array of  expectedRole
  const expectedClassificationArray = expectedClassificationRoles
    ? expectedClassificationRoles.map((es) => (
        <li data-h2-font-weight="b(700)" key={es?.role}>
          {es ? getClassificationRoles(es.role).defaultMessage : ""}
        </li>
      ))
    : null;
  // styling a text bit with red colour within intl
  function redText(msg: string) {
    return <span data-h2-font-color="b(red)">{msg}</span>;
  }

  return (
    <div id="role-and-salary-expectations">
      <div
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(all, m)"
        data-h2-radius="b(s)"
      >
        {expectedClassificationArray !== null &&
          expectedClassificationArray.length > 0 && (
            <>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be referred for jobs at the following levels:",
                  description:
                    "Label for Role and salary expectations sections",
                })}
              </p>
              <ul data-h2-padding="b(left, l)">
                {expectedClassificationArray}
              </ul>
            </>
          )}
        {(expectedClassificationArray === null ||
          expectedClassificationArray.length <= 0) && (
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
      </div>
    </div>
  );
};

export default RoleSalarySection;
