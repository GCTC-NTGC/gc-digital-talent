import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";
import useRoutes from "~/hooks/useRoutes";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

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

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const govEmployeeMessage = user?.isGovEmployee
    ? intl.formatMessage({
        defaultMessage: "Yes, I am a Government of Canada employee.",
        id: "KD5H5s",
        description: "Message to state user is employed by government",
      })
    : intl.formatMessage({
        defaultMessage: "No, I am not a Government of Canada employee.",
        id: "usRTou",
        description: "Message to state user is not employed by government",
      });

  const priorityMessage = user?.hasPriorityEntitlement
    ? intl.formatMessage({
        defaultMessage: "Yes, I do have a priority entitlement.",
        id: "FVAQCH",
        description: "affirm possession of priority entitlement",
      })
    : intl.formatMessage({
        defaultMessage: "No, I do not have a priority entitlement.",
        id: "I6Qz7N",
        description: "affirm no entitlement",
      });

  const handleVerifyNowClick = async () => {
    await navigate(routes.verifyWorkEmail());
  };

  return (
    <div className="flex flex-col gap-y-6">
      <FieldDisplay
        hasError={empty(user?.isGovEmployee)}
        label={intl.formatMessage({
          defaultMessage: "Government employee status",
          id: "YMAXhb",
          description: "Employee status label",
        })}
      >
        {empty(user?.isGovEmployee) ? notProvided : govEmployeeMessage}
      </FieldDisplay>
      {user?.isGovEmployee && (
        <>
          <FieldDisplay label={intl.formatMessage(commonMessages.department)}>
            {user?.department ? user?.department.name.localized : notProvided}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Employment type",
              id: "xzSXz9",
              description: "Employment type label",
            })}
          >
            {user?.govEmployeeType
              ? user?.govEmployeeType.label.localized
              : notProvided}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Current group and classification",
              id: "EHh5pb",
              description: "Current group and classification label",
            })}
          >
            {!!user?.currentClassification?.group &&
            !!user?.currentClassification?.level
              ? wrapAbbr(
                  `${user?.currentClassification?.group}-${user?.currentClassification?.level < 10 ? "0" : ""}${user?.currentClassification?.level}`,
                  intl,
                )
              : notProvided}
          </FieldDisplay>
          <FieldDisplay
            hasError={!user?.workEmail}
            label={intl.formatMessage({
              defaultMessage: "Work email",
              id: "tj9Dz3",
              description: "Work email label",
            })}
          >
            <div className="flex items-center gap-3">
              <span>{user?.workEmail ?? notProvided}</span>
              {showEmailVerification && user?.workEmail ? (
                <EmailVerificationStatus
                  isEmailVerified={!!user?.isWorkEmailVerified}
                  onClickVerify={handleVerifyNowClick}
                  readOnly={readOnly}
                />
              ) : null}
            </div>
          </FieldDisplay>
        </>
      )}
      <FieldDisplay
        hasError={empty(user?.hasPriorityEntitlement)}
        label={intl.formatMessage(profileMessages.priorityStatus)}
      >
        {empty(user?.hasPriorityEntitlement) ? notProvided : priorityMessage}
      </FieldDisplay>
      {user?.hasPriorityEntitlement && (
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Priority number",
            id: "hRzk4m",
            description: "Priority number label",
          })}
        >
          {user?.priorityNumber ?? notProvided}
        </FieldDisplay>
      )}
    </div>
  );
};

export default Display;
