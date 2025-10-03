import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";
import useRoutes from "~/hooks/useRoutes";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import governmentMessages from "~/messages/governmentMessages";

import EmailVerificationStatus from "../EmailVerificationStatus";

export const GovernmentInformationDisplay_Fragment = graphql(/** GraphQL */ `
  fragment GovernmentInformationDisplay on User {
    isGovEmployee
    hasPriorityEntitlement
    priorityNumber
    govEmployeeType {
      value
      label {
        localized
      }
    }
    department {
      id
      name {
        localized
      }
    }
    currentClassification {
      group
      level
    }
    workEmail
    isWorkEmailVerified
  }
`);

interface DisplayProps {
  query: FragmentType<typeof GovernmentInformationDisplay_Fragment>;
  showEmailVerification?: boolean;
  readOnly?: boolean;
}

const Display = ({
  query,
  showEmailVerification = false,
  readOnly = false,
}: DisplayProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const routes = useRoutes();
  const user = getFragment(GovernmentInformationDisplay_Fragment, query);
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

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const govEmployeeMessage = isGovEmployee
    ? intl.formatMessage(governmentMessages.yesGovEmployee)
    : intl.formatMessage(governmentMessages.noGovEmployee);

  const priorityMessage = hasPriorityEntitlement
    ? intl.formatMessage(governmentMessages.yesPriorityEntitlement)
    : intl.formatMessage(governmentMessages.noPriorityEntitlement);

  const handleVerifyNowClick = async () => {
    await navigate(routes.verifyWorkEmail());
  };

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
            {department ? department.name.localized : notProvided}
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
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Current group and classification",
              id: "EHh5pb",
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
              {showEmailVerification && workEmail ? (
                <EmailVerificationStatus
                  isEmailVerified={!!isWorkEmailVerified}
                  onClickVerify={handleVerifyNowClick}
                  readOnly={readOnly}
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

export default Display;
