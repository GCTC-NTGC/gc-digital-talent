import React from "react";
import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import { enumToOptions } from "@gc-digital-talent/forms";
import {
  commonMessages,
  getGovEmployeeType,
  getLocale,
} from "@gc-digital-talent/i18n";

import { wrapAbbr } from "~/utils/nameUtils";
import { User, GovEmployeeType } from "~/api/generated";
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
        <div data-h2-flex-grid="base(flex-start, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Employee status:",
                  id: "z/J4uL",
                  description: "Label for applicant's employee status",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Yes</strong>, I am a Government of Canada employee.",
                  id: "5d0vbr",
                  description:
                    "Message to state user is employed by government",
                })}
              </span>
            </p>
          </div>
          {user.department && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Department:",
                    id: "ny/ddo",
                    description:
                      "Label for applicant's Government of Canada department",
                  })}
                </span>
                <span data-h2-font-weight="base(700)">
                  {user.department.name[locale]}
                </span>
              </p>
            </div>
          )}
          {user.govEmployeeType && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Employment type:",
                    id: "T49QiO",
                    description: "Label for applicant's employment type",
                  })}
                </span>
                <span data-h2-font-weight="base(700)">
                  {intl.formatMessage(getGovEmployeeType(govEmployeeTypeId))}
                </span>
              </p>
            </div>
          )}
          {!!user.currentClassification?.group &&
            !!user.currentClassification?.level && (
              <div data-h2-flex-item="base(1of1)">
                <p>
                  <span data-h2-display="base(block)">
                    {intl.formatMessage({
                      defaultMessage: "Current group and classification:",
                      id: "MuyuAu",
                      description:
                        "Field label before government employment group and level, followed by colon",
                    })}
                  </span>
                  <span data-h2-font-weight="base(700)">
                    {wrapAbbr(
                      `${user.currentClassification?.group}-${user.currentClassification?.level}`,
                      intl,
                    )}
                  </span>
                </p>
              </div>
            )}
        </div>
      )}
      {user.isGovEmployee === false && editPath && (
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

      {user.isGovEmployee === false && !editPath && (
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

      {user.hasPriorityEntitlement !== null && (
        <div
          data-h2-flex-grid="base(flex-start, x2, x1)"
          data-h2-padding="base(x1, 0, 0, 0)"
        >
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Priority entitlement:",
                  id: "swugkW",
                  description:
                    "Label for applicant's priority entitlement status",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
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
          </div>
          {user.priorityNumber && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Priority number:",
                    id: "ZUO1OX",
                    description: "Label for applicant's priority number value",
                  })}
                </span>
                <span data-h2-font-weight="base(700)">
                  {user.priorityNumber}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
      {hasAllEmptyFields(user) && editPath && (
        <div data-h2-flex-grid="base(flex-start, x2, x1)">
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                id: "SCCX7B",
                description: "Message for when no data exists for the section",
              })}
            </p>
          </div>
        </div>
      )}

      {hasEmptyRequiredFields(user) && editPath && (
        <div
          data-h2-flex-grid="base(flex-start, x2, x1)"
          data-h2-padding="base(x1, 0, 0, 0)"
        >
          <div data-h2-flex-item="base(1of1)">
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
        </div>
      )}

      {user.isGovEmployee === null &&
        user.hasPriorityEntitlement === null &&
        !editPath && (
          <div data-h2-flex-grid="base(flex-start, x2, x1)">
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage: "No information has been provided.",
                  id: "ugRTOW",
                  description:
                    "Message on Admin side when user not filled GovernmentInformation section.",
                })}
              </p>
            </div>
          </div>
        )}
    </Well>
  );
};

export default GovernmentInformationSection;
