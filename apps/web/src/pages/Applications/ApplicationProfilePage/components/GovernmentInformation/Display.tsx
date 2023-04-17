import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";
import { enumToOptions } from "@gc-digital-talent/forms";
import { getGovEmployeeType, getLocalizedName } from "@gc-digital-talent/i18n";

import { wrapAbbr } from "~/utils/nameUtils";
import { GovEmployeeType } from "~/api/generated";

import FieldDisplay from "../FieldDisplay";

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
      <FieldDisplay
        hasError={!isGovEmployee === null}
        label={intl.formatMessage({
          defaultMessage: "Employee status",
          id: "um8A1S",
          description: "Employee status label",
        })}
      >
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
              id: "mTgQV0",
              description: "Message to state user is employed by government",
            })}
      </FieldDisplay>
      {isGovEmployee && (
        <>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Department",
              id: "CBnsBK",
              description: "Department label",
            })}
          >
            {department && (
              <span>{getLocalizedName(department.name, intl)}</span>
            )}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Employment type",
              id: "xzSXz9",
              description: "Employment type label",
            })}
          >
            {govEmployeeTypeId &&
              intl.formatMessage(getGovEmployeeType(govEmployeeTypeId))}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Current group and classification",
              id: "EHh5pb",
              description: "Current group and classification label",
            })}
          >
            {!!currentClassification?.group &&
              !!currentClassification?.level &&
              wrapAbbr(
                `${currentClassification?.group}-${currentClassification?.level}`,
                intl,
              )}
          </FieldDisplay>
        </>
      )}
      <FieldDisplay
        hasError={hasPriorityEntitlement === null}
        label={intl.formatMessage({
          defaultMessage: "Priority entitlement",
          id: "gdivWF",
          description: "Priority entitlement label",
        })}
      >
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
      </FieldDisplay>
      {hasPriorityEntitlement && (
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Priority number",
            id: "hRzk4m",
            description: "Priority number label",
          })}
        >
          {priorityNumber}
        </FieldDisplay>
      )}
    </div>
  );
};

export default Display;
