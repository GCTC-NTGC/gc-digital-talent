import React from "react";
import { useIntl } from "react-intl";
import { enumToOptions } from "../../../helpers/formUtils";
import { getGovEmployeeType } from "../../../constants/localizedConstants";
import { getLocale } from "../../../helpers/localize";
import { Applicant, GovEmployeeType } from "../../../api/generated";

// styling a text bit with red colour within intls
function redText(msg: string) {
  return <span data-h2-color="base(dt-error)">{msg}</span>;
}

const GovernmentInformationSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    | "isGovEmployee"
    | "govEmployeeType"
    | "interestedInLaterOrSecondment"
    | "department"
    | "currentClassification"
  >;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const govEmployeeTypeId =
    enumToOptions(GovEmployeeType).find(
      (govEmployeeType) => govEmployeeType.value === applicant.govEmployeeType,
    )?.value || "";
  return (
    <div
      data-h2-background-color="base(light.dt-gray)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      {applicant.isGovEmployee && (
        <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {/* // TODO add translation for label */}
              Employee status:
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Yes</strong>, I am a Government of Canada employee.",
                  description:
                    "Message to state user is employed by government",
                })}
              </span>
            </p>
          </div>
          {applicant.department && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {/* // TODO add translation for label */}
                Department:
                <br />
                <span data-h2-font-weight="base(700)">
                  {/* // TODO remove department from INTL message */}
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Department: <strong>{department}</strong>",
                      description:
                        "Message to state what department user is in.",
                    },
                    { department: applicant.department.name[locale] },
                  )}
                </span>
              </p>
            </div>
          )}
          {applicant.govEmployeeType && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {/* // TODO add translation for label */}
                Employment type:
                <br />
                <span data-h2-font-weight="base(700)">
                  {intl.formatMessage(getGovEmployeeType(govEmployeeTypeId))}
                </span>
              </p>
            </div>
          )}
          {applicant.interestedInLaterOrSecondment && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {/* // TODO add translation for label */}
                Deployment preferences:
                <br />
                <span data-h2-font-weight="base(700)">
                  {intl.formatMessage({
                    defaultMessage:
                      "I am interested in lateral deployment or secondment.",
                    description:
                      "Message to state user is interested in lateral deployment or secondment",
                  })}
                </span>
              </p>
            </div>
          )}
          {!!applicant.currentClassification?.group &&
            !!applicant.currentClassification?.level && (
              <div data-h2-flex-item="base(1of1)">
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Current group and classification:",
                    description:
                      "Field label before government employment group and level, followed by colon",
                  })}
                  <br />
                  <span data-h2-font-weight="base(700)">
                    {applicant.currentClassification?.group}-
                    {applicant.currentClassification?.level}
                  </span>
                </p>
              </div>
            )}
        </div>
      )}
      {applicant.isGovEmployee === null && editPath && (
        <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                description: "Message for when no data exists for the section",
              })}
            </p>
          </div>
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "There are <red>required</red> fields missing.",
                description:
                  "Message that there are required fields missing. Please ignore things in <> tags.",
              })}
              <a href={editPath}>
                {intl.formatMessage({
                  defaultMessage: "Click here to get started.",
                  description:
                    "Message to click on the words to begin something",
                })}
              </a>
            </p>
          </div>
        </div>
      )}

      {applicant.isGovEmployee === null && !editPath && (
        <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "No information has been provided.",
                description:
                  "Message on Admin side when user not filled GovernmentInformation section.",
              })}
            </p>
          </div>
        </div>
      )}
      {applicant.isGovEmployee === false && editPath && (
        <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You are not entered as a current government employee.",
                description:
                  "Message indicating the user is not marked in the system as being federally employed currently",
              })}
            </p>
          </div>
        </div>
      )}
      {applicant.isGovEmployee === false && !editPath && (
        <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "I am not a current government employee.",
                description:
                  "Message indicating the user is not marked in the system as being federally employed currently",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentInformationSection;
