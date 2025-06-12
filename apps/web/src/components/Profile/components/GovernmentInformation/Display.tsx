import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import { Button, Chip } from "@gc-digital-talent/ui";

import { wrapAbbr } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";
import useRoutes from "~/hooks/useRoutes";

import { PartialUser } from "./types";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

interface DisplayProps {
  user: PartialUser;
  showEmailVerification?: boolean;
}

const Display = ({
  user: {
    isGovEmployee,
    department,
    govEmployeeType,
    currentClassification,
    hasPriorityEntitlement,
    priorityNumber,
    workEmail,
    isWorkEmailVerified,
  },
  showEmailVerification = false,
}: DisplayProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const routes = useRoutes();

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const govEmployeeMessage = isGovEmployee
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

  const priorityMessage = hasPriorityEntitlement
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

  const emailVerificationComponents = isWorkEmailVerified ? (
    <Chip color="success">
      {intl.formatMessage({
        defaultMessage: "Verified",
        id: "GMglI5",
        description: "The email address has been verified to be owned by user",
      })}
    </Chip>
  ) : (
    <>
      <Chip color="error">
        {intl.formatMessage({
          defaultMessage: "Unverified",
          id: "tUIvbq",
          description:
            "The email address has not been verified to be owned by user",
        })}
      </Chip>
      <Button
        type="button"
        mode="inline"
        color="error"
        onClick={handleVerifyNowClick}
      >
        {intl.formatMessage({
          defaultMessage: "Verify now",
          id: "ADPfNp",
          description: "Button to start the email address verification process",
        })}
      </Button>
    </>
  );

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
            {department ? getLocalizedName(department.name, intl) : notProvided}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Employment type",
              id: "xzSXz9",
              description: "Employment type label",
            })}
          >
            {getLocalizedName(govEmployeeType?.label, intl)}
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
          <div className="flex items-end gap-3">
            <FieldDisplay
              hasError={!workEmail}
              label={intl.formatMessage({
                defaultMessage: "Work email",
                id: "tj9Dz3",
                description: "Work email label",
              })}
            >
              {workEmail ?? notProvided}
            </FieldDisplay>
            {showEmailVerification && workEmail
              ? emailVerificationComponents
              : null}
          </div>
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
