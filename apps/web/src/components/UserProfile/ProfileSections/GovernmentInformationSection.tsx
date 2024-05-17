import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import { enumToOptions } from "@gc-digital-talent/forms";
import {
  commonMessages,
  getGovEmployeeType,
  getLocale,
} from "@gc-digital-talent/i18n";
import { User, GovEmployeeType } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/governmentInformation";

const GovernmentInformationSection = ({
  user,
  editPath,
}: {
  user: User;
  editPath?: string;
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const govEmployeeTypeId =
    enumToOptions(GovEmployeeType).find(
      (govEmployeeType) => govEmployeeType.value === user.govEmployeeType,
    )?.value || "";
  return (
    <Well>
      {user.isGovEmployee && (
        <div className="flex flex-col gap-y-6">
          <p>
            <span className="block">
              {intl.formatMessage({
                defaultMessage: "Employee status:",
                id: "z/J4uL",
                description: "Label for applicant's employee status",
              })}
            </span>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Yes</strong>, I am a Government of Canada employee.",
                id: "gto/zD",
                description:
                  "Label displayed for is a government employee option",
              })}
            </span>
          </p>
          {user.department && (
            <p>
              <span className="block">
                {intl.formatMessage({
                  defaultMessage: "Department:",
                  id: "ny/ddo",
                  description:
                    "Label for applicant's Government of Canada department",
                })}
              </span>
              <span className="font-bold">{user.department.name[locale]}</span>
            </p>
          )}
          {user.govEmployeeType && (
            <p>
              <span className="block">
                {intl.formatMessage({
                  defaultMessage: "Employment type:",
                  id: "T49QiO",
                  description: "Label for applicant's employment type",
                })}
              </span>
              <span className="font-bold">
                {intl.formatMessage(getGovEmployeeType(govEmployeeTypeId))}
              </span>
            </p>
          )}
          {!!user.currentClassification?.group &&
            !!user.currentClassification?.level && (
              <p>
                <span className="block">
                  {intl.formatMessage({
                    defaultMessage: "Current group and classification:",
                    id: "MuyuAu",
                    description:
                      "Field label before government employment group and level, followed by colon",
                  })}
                </span>
                <span className="font-bold">
                  {wrapAbbr(
                    `${user.currentClassification?.group}-${user.currentClassification?.level}`,
                    intl,
                  )}
                </span>
              </p>
            )}
        </div>
      )}
      {user.isGovEmployee === false && editPath && (
        <div className="flex flex-col gap-y-6">
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
      )}

      {user.isGovEmployee === false && !editPath && (
        <div className="flex flex-col gap-y-6">
          <p>
            {intl.formatMessage({
              defaultMessage: "I am not a current government employee.",
              id: "eLXTfi",
              description:
                "Message indicating the user is not marked in the system as being federally employed currently",
            })}
          </p>
        </div>
      )}

      {user.hasPriorityEntitlement !== null && (
        <div className="mt-6 flex flex-col gap-y-6">
          <p>
            <span className="block">
              {intl.formatMessage({
                defaultMessage: "Priority entitlement:",
                id: "swugkW",
                description:
                  "Label for applicant's priority entitlement status",
              })}
            </span>
            <span className="font-bold">
              {user.hasPriorityEntitlement
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
          {user.hasPriorityEntitlement && (
            <p>
              <span className="block">
                {intl.formatMessage({
                  defaultMessage: "Priority number:",
                  id: "ZUO1OX",
                  description: "Label for applicant's priority number value",
                })}
              </span>
              <span className="font-bold">
                {user.priorityNumber
                  ? user.priorityNumber
                  : intl.formatMessage(commonMessages.notProvided)}
              </span>
            </p>
          )}
        </div>
      )}
      {hasAllEmptyFields(user) && editPath && (
        <div className="flex flex-col gap-y-6">
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              id: "SCCX7B",
              description: "Message for when no data exists for the section",
            })}
          </p>
        </div>
      )}

      {hasEmptyRequiredFields(user) && editPath && (
        <div className="mt-6 flex flex-col gap-y-6">
          <p>
            {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
            <Link href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Edit your government information options.",
                id: "3pox8N",
                description:
                  "Link text to edit government information on profile.",
              })}
            </Link>
          </p>
        </div>
      )}

      {user.isGovEmployee === null &&
        user.hasPriorityEntitlement === null &&
        !editPath && (
          <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
        )}
    </Well>
  );
};

export default GovernmentInformationSection;
