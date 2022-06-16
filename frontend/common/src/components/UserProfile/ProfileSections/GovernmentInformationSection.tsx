import React from "react";
import { useIntl } from "react-intl";
import { Applicant, GovEmployeeType } from "../../../api/generated";

// styling a text bit with red colour within intls
function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

const GovernmentInformationSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    | "isGovEmployee"
    | "govEmployeeType"
    | "interestedInLaterOrSecondment"
    | "currentClassification"
  >;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
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
              {intl.formatMessage({
                defaultMessage: "Yes, I am a Government of Canada employee.",
                description: "Message to state user is employed by government",
              })}
            </li>
            {applicant.govEmployeeType && (
              <li>
                {applicant.govEmployeeType === GovEmployeeType.Student &&
                  intl.formatMessage({
                    defaultMessage: "I have a student position",
                    description:
                      "Message to state user is employed federally in a student position",
                  })}
                {applicant.govEmployeeType === GovEmployeeType.Casual &&
                  intl.formatMessage({
                    defaultMessage: "I have a casual position",
                    description:
                      "Message to state user is employed federally in a casual position",
                  })}
                {applicant.govEmployeeType === GovEmployeeType.Term &&
                  intl.formatMessage({
                    defaultMessage: "I have a term position",
                    description:
                      "Message to state user is employed federally in a term position",
                  })}
                {applicant.govEmployeeType === GovEmployeeType.Indeterminate &&
                  intl.formatMessage({
                    defaultMessage: "I have an indeterminate position",
                    description:
                      "Message to state user is employed federally in an indeterminate position",
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
        {applicant.isGovEmployee === null && editPath && (
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
              )}
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
        {applicant.isGovEmployee === null && !editPath && (
          <p>
            {intl.formatMessage({
              defaultMessage: "No information has been provided.",
              description:
                "Message on Admin side when user not filled GovernmentInformation section.",
            })}
          </p>
        )}
        {applicant.isGovEmployee === false && editPath && (
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You are not entered as a current government employee.",
              description:
                "Message indicating the user is not marked in the system as being federally employed currently",
            })}
          </p>
        )}
        {applicant.isGovEmployee === false && !editPath && (
          <p>
            {intl.formatMessage({
              defaultMessage: "I am not a current government employee.",
              description:
                "Message indicating the user is not marked in the system as being federally employed currently",
            })}
          </p>
        )}
      </ul>
    </div>
  );
};

export default GovernmentInformationSection;
