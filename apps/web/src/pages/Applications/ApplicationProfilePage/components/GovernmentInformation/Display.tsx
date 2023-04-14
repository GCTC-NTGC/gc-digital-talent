import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";
import { enumToOptions } from "@gc-digital-talent/forms";
import { getGovEmployeeType, getLocalizedName } from "@gc-digital-talent/i18n";

import { wrapAbbr } from "~/utils/nameUtils";
import { GovEmployeeType } from "~/api/generated";

import ProfileLabel from "../ProfileLabel";

interface DisplayProps {
  user: User;
}

const Display = ({
  user: {
    isGovEmployee,
    department,
    govEmployeeType,
    currentClassification,
    hasPriorityEntitlement,
    priorityNumber,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const govEmployeeTypeId =
    enumToOptions(GovEmployeeType).find(
      (type) => type.value === govEmployeeType,
    )?.value || "";

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      <p>
        <ProfileLabel>
          {intl.formatMessage({
            defaultMessage: "Employee status:",
            id: "z/J4uL",
            description: "Label for applicant's employee status",
          })}
        </ProfileLabel>
        <span>
          {isGovEmployee
            ? intl.formatMessage({
                defaultMessage:
                  "<strong>Yes</strong>, I am a Government of Canada employee.",
                id: "5d0vbr",
                description: "Message to state user is employed by government",
              })
            : intl.formatMessage({
                defaultMessage:
                  "I am <strong>not</strong> a Government of Canada employee.",
                id: "5d0vbr",
                description: "Message to state user is employed by government",
              })}
        </span>
      </p>
      {isGovEmployee && (
        <>
          <p>
            <ProfileLabel>
              {intl.formatMessage({
                defaultMessage: "Department:",
                id: "ny/ddo",
                description:
                  "Label for applicant's Government of Canada department",
              })}
            </ProfileLabel>
            {department && (
              <span>{getLocalizedName(department.name, intl)}</span>
            )}
          </p>
          <p>
            <ProfileLabel>
              {intl.formatMessage({
                defaultMessage: "Employment type:",
                id: "T49QiO",
                description: "Label for applicant's employment type",
              })}
            </ProfileLabel>
            {govEmployeeTypeId && (
              <span>
                {intl.formatMessage(getGovEmployeeType(govEmployeeTypeId))}
              </span>
            )}
          </p>
          {!!currentClassification?.group && !!currentClassification?.level && (
            <p>
              <ProfileLabel>
                {intl.formatMessage({
                  defaultMessage: "Current group and classification:",
                  id: "MuyuAu",
                  description:
                    "Field label before government employment group and level, followed by colon",
                })}
              </ProfileLabel>
              <span>
                {wrapAbbr(
                  `${currentClassification?.group}-${currentClassification?.level}`,
                  intl,
                )}
              </span>
            </p>
          )}
        </>
      )}
      <p>
        <ProfileLabel>
          {intl.formatMessage({
            defaultMessage: "Priority entitlement:",
            id: "swugkW",
            description: "Label for applicant's priority entitlement status",
          })}
        </ProfileLabel>
        <span>
          {hasPriorityEntitlement !== null && hasPriorityEntitlement
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
      {hasPriorityEntitlement && priorityNumber && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Priority number:",
              id: "ZUO1OX",
              description: "Label for applicant's priority number value",
            })}
          </ProfileLabel>
          <span>{priorityNumber}</span>
        </p>
      )}
    </div>
  );
};

export default Display;
