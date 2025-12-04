import { useIntl } from "react-intl";

import {
  LocalizedGovEmployeeType,
  LocalizedGovPositionType,
  Maybe,
  GovEmployeeType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";

import governmentMessages from "~/messages/governmentMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { wrapAbbr } from "~/utils/nameUtils";
import EmailVerificationStatus from "~/components/Profile/components/EmailVerificationStatus";
import profileMessages from "~/messages/profileMessages";
import { formattedDate } from "~/utils/dateUtils";

import { RelatedSnapshotModel, SnapshotProps } from "../types";

export interface GovernmentInformationSnapshotV1 {
  isGovEmployee?: Maybe<boolean>;
  department?: Maybe<RelatedSnapshotModel<"name">>;
  govEmployeeType?: Maybe<LocalizedGovEmployeeType>;
  govPositionType?: Maybe<LocalizedGovPositionType>;
  govEndDate?: Maybe<string>;
  currentClassification?: Maybe<{ group: string; level: number }>;
  hasPriorityEntitlement?: Maybe<boolean>;
  priorityNumber?: Maybe<string>;
  workEmail?: Maybe<string>;
  isWorkEmailVerified?: Maybe<boolean>;
}

export type GovernmentInformationV1Props =
  SnapshotProps<GovernmentInformationSnapshotV1>;

const GovernmentInformationV1 = ({
  snapshot,
}: GovernmentInformationV1Props) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const {
    isGovEmployee,
    department,
    govEmployeeType,
    govPositionType,
    govEndDate,
    currentClassification,
    hasPriorityEntitlement,
    priorityNumber,
    workEmail,
    isWorkEmailVerified,
  } = snapshot;

  const govEmployeeMessage = isGovEmployee
    ? intl.formatMessage(governmentMessages.yesGovEmployee)
    : intl.formatMessage(governmentMessages.noGovEmployee);

  const priorityMessage = hasPriorityEntitlement
    ? intl.formatMessage(governmentMessages.yesPriorityEntitlement)
    : intl.formatMessage(governmentMessages.noPriorityEntitlement);

  //check for employment type
  const isIndeterminate =
    govEmployeeType?.value === GovEmployeeType.Indeterminate;

  // show end date for not indeterminate and is a gov employee
  const showEndDate = !isIndeterminate && isGovEmployee;

  // format end date using utility
  const formattedEndDate = govEndDate
    ? formattedDate(govEndDate, intl)
    : notProvided;

  return (
    <div className="flex flex-col gap-y-6">
      <FieldDisplay
        hasError={empty(isGovEmployee)}
        label={intl.formatMessage({
          defaultMessage: "Government employee status",
          id: "YMAXhb",
          description: "Employee status label",
        })}
      >
        {empty(isGovEmployee) ? notProvided : govEmployeeMessage}
      </FieldDisplay>
      {isGovEmployee && (
        <>
          <FieldDisplay label={intl.formatMessage(commonMessages.department)}>
            {department ? department?.name?.localized : notProvided}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Employment type",
              id: "xzSXz9",
              description: "Employment type label",
            })}
          >
            {govEmployeeType ? govEmployeeType.label.localized : notProvided}
          </FieldDisplay>
          {isIndeterminate && (
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Position type",
                id: "0Dp1N4",
                description: "Label for the position type radio group",
              })}
            >
              {govPositionType ? govPositionType.label.localized : notProvided}
            </FieldDisplay>
          )}
          {showEndDate && (
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Expected end date",
                id: "0qwyH4",
                description:
                  "Label displayed on an Experience form for expected end date input",
              })}
            >
              {formattedEndDate}
            </FieldDisplay>
          )}
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Classification",
              id: "Nv+wR8",
              description: "Current group and classification label",
            })}
          >
            {!!currentClassification?.group && !!currentClassification?.level
              ? wrapAbbr(
                  `${currentClassification?.group}-${currentClassification?.level < 10 ? "0" : ""}${currentClassification?.level}`,
                  intl,
                )
              : notProvided}
          </FieldDisplay>
          <FieldDisplay
            hasError={!workEmail}
            label={intl.formatMessage({
              defaultMessage: "Work email",
              id: "tj9Dz3",
              description: "Work email label",
            })}
          >
            <div className="flex items-center gap-3">
              <span>{workEmail ?? notProvided}</span>
              {workEmail ? (
                <EmailVerificationStatus
                  isEmailVerified={!!isWorkEmailVerified}
                  readOnly
                />
              ) : null}
            </div>
          </FieldDisplay>
        </>
      )}
      <FieldDisplay
        hasError={empty(hasPriorityEntitlement)}
        label={intl.formatMessage(profileMessages.priorityStatus)}
      >
        {empty(hasPriorityEntitlement) ? notProvided : priorityMessage}
      </FieldDisplay>
      {hasPriorityEntitlement && (
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Priority number",
            id: "hRzk4m",
            description: "Priority number label",
          })}
        >
          {priorityNumber ?? notProvided}
        </FieldDisplay>
      )}
    </div>
  );
};

export default GovernmentInformationV1;
