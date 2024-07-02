import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";

const GovernmentInformationSection = ({ user }: { user: User }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

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
                  id: "gto/zD",
                  description:
                    "Label displayed for is a government employee option",
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
                  {getLocalizedName(user.govEmployeeType.label, intl)}
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
      {user.isGovEmployee === false && (
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
      {user.isGovEmployee === false && (
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
          {user.hasPriorityEntitlement && (
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
                  {user.priorityNumber
                    ? user.priorityNumber
                    : intl.formatMessage(commonMessages.notProvided)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {user.isGovEmployee === null && user.hasPriorityEntitlement === null && (
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
