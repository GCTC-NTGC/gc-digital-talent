import React from "react";
import { useIntl } from "react-intl";
import { enumToOptions } from "../../../helpers/formUtils";
import { getGovEmployeeType } from "../../../constants/localizedConstants";
import { getLocale } from "../../../helpers/localize";
import { strong } from "../../../helpers/format";
import { Applicant, GovEmployeeType } from "../../../api/generated";

const GovernmentInformationSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    | "isGovEmployee"
    | "govEmployeeType"
    | "interestedInLaterOrSecondment"
    | "department"
    | "currentClassification"
  >;
}> = ({ applicant }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const govEmployeeTypeId =
    enumToOptions(GovEmployeeType).find(
      (govEmployeeType) => govEmployeeType.value === applicant.govEmployeeType,
    )?.value || "";
  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      <ul data-h2-padding="b(left, s)">
        {applicant.isGovEmployee && (
          <>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>Yes</strong>, I am a Government of Canada employee.",
                  description:
                    "Message to state user is employed by government",
                },
                { strong },
              )}
            </li>
            {applicant.department && (
              <li>
                {intl.formatMessage(
                  {
                    defaultMessage: "Department: <strong>{department}</strong>",
                    description: "Message to state what department user is in.",
                  },
                  { strong, department: applicant.department.name[locale] },
                )}
              </li>
            )}
            {applicant.govEmployeeType && (
              <li>
                {intl.formatMessage(getGovEmployeeType(govEmployeeTypeId), {
                  strong,
                })}
              </li>
            )}
            {applicant.interestedInLaterOrSecondment && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I am interested in lateral deployment or secondment.",
                  description:
                    "Message to state user is interested in lateral deployment or secondment",
                })}
              </li>
            )}
            {!!applicant.currentClassification?.group &&
              !!applicant.currentClassification?.level && (
                <li>
                  {" "}
                  {intl.formatMessage({
                    defaultMessage: "Current group and classification:",
                    description:
                      "Field label before government employment group and level, followed by colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {applicant.currentClassification?.group}-
                    {applicant.currentClassification?.level}
                  </span>
                </li>
              )}
          </>
        )}
        {applicant.isGovEmployee === null && (
          <li>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              description: "Message for when no data exists for the section",
            })}
          </li>
        )}
        {applicant.isGovEmployee === false && (
          <li>
            {intl.formatMessage({
              defaultMessage:
                "You are not entered as a current government employee",
              description:
                "Message indicating the user is not marked in the system as being federally employed currently",
            })}
          </li>
        )}
      </ul>
    </div>
  );
};

export default GovernmentInformationSection;
