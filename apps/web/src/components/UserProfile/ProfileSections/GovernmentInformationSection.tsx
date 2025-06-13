import { useIntl } from "react-intl";

import { Chip, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";

import { styles } from "./styles";

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
  const { well, label, value } = styles();

  return (
    <Well className={well()}>
      {isGovEmployee && (
        <>
          <p>
            <span className={label()}>
              {intl.formatMessage({
                defaultMessage: "Employee status",
                id: "ia3ceX",
                description: "Label for applicant's employee status",
              })}
            </span>
            <span className={value()}>
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Yes</strong>, I am a Government of Canada employee.",
                id: "gto/zD",
                description:
                  "Label displayed for is a government employee option",
              })}
            </span>
          </p>
          {department && (
            <p>
              <span className={label()}>
                {intl.formatMessage({
                  defaultMessage: "Department",
                  id: "M7bb1V",
                  description:
                    "Label for applicant's Government of Canada department",
                })}
              </span>
              <span className={value()}>{department.name[locale]}</span>
            </p>
          )}
          {govEmployeeType && (
            <p>
              <span className={label()}>
                {intl.formatMessage({
                  defaultMessage: "Employment type",
                  id: "2Oubfe",
                  description: "Label for applicant's employment type",
                })}
              </span>
              <span className={value()}>
                {getLocalizedName(govEmployeeType.label, intl)}
              </span>
            </p>
          )}
          {!!currentClassification?.group && !!currentClassification?.level && (
            <p>
              <span className={label()}>
                {intl.formatMessage({
                  defaultMessage: "Current group and classification",
                  id: "yMs04A",
                  description:
                    "Field label before government employment group and level, followed by colon",
                })}
              </span>
              <span className={value()}>
                {wrapAbbr(
                  `${currentClassification?.group}-${currentClassification?.level < 10 ? "0" : ""}${currentClassification?.level}`,
                  intl,
                )}
              </span>
            </p>
          )}
          {workEmail && (
            <p>
              <span className={label()}>
                {intl.formatMessage({
                  defaultMessage: "Work email",
                  id: "tj9Dz3",
                  description: "Work email label",
                })}
              </span>
              <span className={value({ class: "flex items-end gap-x-3" })}>
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
          )}
        </>
      )}
      {isGovEmployee === false && (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You are not entered as a current government employee.",
            id: "9pdtnR",
            description:
              "Message indicating the user is not marked in the system as being federally employed currently",
          })}
        </p>
      )}
      {isGovEmployee === false && (
        <p>
          {intl.formatMessage({
            defaultMessage: "I am not a current government employee.",
            id: "eLXTfi",
            description:
              "Message indicating the user is not marked in the system as being federally employed currently",
          })}
        </p>
      )}
      {hasPriorityEntitlement !== null && (
        <>
          <p>
            <span className={label()}>
              {intl.formatMessage({
                defaultMessage: "Priority entitlement",
                id: "Wd/+eR",
                description:
                  "Label for applicant's priority entitlement status",
              })}
            </span>
            <span className={value()}>
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
          {hasPriorityEntitlement && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span className={label()}>
                  {intl.formatMessage({
                    defaultMessage: "Priority number",
                    id: "mGGj/i",
                    description: "Label for applicant's priority number value",
                  })}
                </span>
                <span className={value()}>
                  {priorityNumber ??
                    intl.formatMessage(commonMessages.notProvided)}
                </span>
              </p>
            </div>
          )}
        </>
      )}

      {isGovEmployee === null && hasPriorityEntitlement === null && (
        <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
      )}
    </Well>
  );
};

export default GovernmentInformationSection;
