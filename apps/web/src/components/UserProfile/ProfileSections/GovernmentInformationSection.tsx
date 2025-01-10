import { useIntl } from "react-intl";

import { Chip, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";

interface GovernmentInformationSectionProps {
  user: Pick<
    User,
    | "isGovEmployee"
    | "department"
    | "govEmployeeType"
    | "currentClassification"
    | "hasPriorityEntitlement"
    | "priorityNumber"
    | "workEmail"
    | "isWorkEmailVerified"
  >;
}

const GovernmentInformationSection = ({
  user,
}: GovernmentInformationSectionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const {
    isGovEmployee,
    department,
    govEmployeeType,
    currentClassification,
    hasPriorityEntitlement,
    priorityNumber,
    workEmail,
    isWorkEmailVerified,
  } = user;

  return (
    <Well>
      {isGovEmployee && (
        <div data-h2-flex-grid="base(flex-start, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Employee status",
                  id: "ia3ceX",
                  description: "Label for applicant's employee status",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Yes</strong>, I am a Government of Canada employee.",
                  id: "gto/zD",
                  description:
                    "Label displayed for is a government employee option",
                })}
              </span>
            </p>
          </div>
          {department && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Department",
                    id: "M7bb1V",
                    description:
                      "Label for applicant's Government of Canada department",
                  })}
                </span>
                <span data-h2-font-weight="base(700)">
                  {department.name[locale]}
                </span>
              </p>
            </div>
          )}
          {govEmployeeType && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Employment type",
                    id: "2Oubfe",
                    description: "Label for applicant's employment type",
                  })}
                </span>
                <span data-h2-font-weight="base(700)">
                  {getLocalizedName(govEmployeeType.label, intl)}
                </span>
              </p>
            </div>
          )}
          {!!currentClassification?.group && !!currentClassification?.level && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Current group and classification",
                    id: "yMs04A",
                    description:
                      "Field label before government employment group and level, followed by colon",
                  })}
                </span>
                <span data-h2-font-weight="base(700)">
                  {wrapAbbr(
                    `${currentClassification?.group}-${currentClassification?.level < 10 ? "0" : ""}${currentClassification?.level}`,
                    intl,
                  )}
                </span>
              </p>
            </div>
          )}
          {workEmail && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Work email",
                    id: "tj9Dz3",
                    description: "Work email label",
                  })}
                </span>
                <span
                  data-h2-font-weight="base(700)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(row)"
                  data-h2-gap="base(x0.5)"
                  data-h2-align-items="base(end)"
                >
                  <span>{workEmail}</span>
                  {isWorkEmailVerified ? (
                    <Chip color="success">
                      {intl.formatMessage({
                        defaultMessage: "Verified",
                        id: "GMglI5",
                        description:
                          "The email address has been verified to be owned by user",
                      })}
                    </Chip>
                  ) : (
                    <Chip color="error">
                      {intl.formatMessage({
                        defaultMessage: "Unverified",
                        id: "tUIvbq",
                        description:
                          "The email address has not been verified to be owned by user",
                      })}
                    </Chip>
                  )}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
      {isGovEmployee === false && (
        <div data-h2-flex-grid="base(flex-start, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You are not entered as a current government employee.",
                id: "9pdtnR",
                description:
                  "Message indicating the user is not marked in the system as being federally employed currently",
              })}
            </p>
          </div>
        </div>
      )}
      {isGovEmployee === false && (
        <div data-h2-flex-grid="base(flex-start, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "I am not a current government employee.",
                id: "eLXTfi",
                description:
                  "Message indicating the user is not marked in the system as being federally employed currently",
              })}
            </p>
          </div>
        </div>
      )}
      {hasPriorityEntitlement !== null && (
        <div
          data-h2-flex-grid="base(flex-start, x2, x1)"
          data-h2-padding="base(x1, 0, 0, 0)"
        >
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Priority entitlement",
                  id: "Wd/+eR",
                  description:
                    "Label for applicant's priority entitlement status",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {hasPriorityEntitlement
                  ? intl.formatMessage({
                      defaultMessage: "I do have a priority entitlement",
                      id: "+tKl71",
                      description: "affirm possession of priority entitlement",
                    })
                  : intl.formatMessage({
                      defaultMessage: "I do not have a priority entitlement",
                      id: "x0FRH/",
                      description: "affirm no entitlement",
                    })}
              </span>
            </p>
          </div>
          {hasPriorityEntitlement && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Priority number",
                    id: "mGGj/i",
                    description: "Label for applicant's priority number value",
                  })}
                </span>
                <span data-h2-font-weight="base(700)">
                  {priorityNumber
                    ? priorityNumber
                    : intl.formatMessage(commonMessages.notProvided)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {isGovEmployee === null && hasPriorityEntitlement === null && (
        <div data-h2-flex-grid="base(flex-start, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
          </div>
        </div>
      )}
    </Well>
  );
};

export default GovernmentInformationSection;
