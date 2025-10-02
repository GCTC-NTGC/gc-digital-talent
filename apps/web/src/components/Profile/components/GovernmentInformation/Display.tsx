import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

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
  }
`);

interface DisplayProps {
  query: FragmentType<typeof GovernmentInformationDisplay_Fragment>;
  showEmailVerification?: boolean;
  readOnly?: boolean;
}

const Display = ({ query }: DisplayProps) => {
  const intl = useIntl();
  const user = getFragment(GovernmentInformationDisplay_Fragment, query);
  const {
    isGovEmployee,
    department,
    govEmployeeType,
    currentClassification,
    hasPriorityEntitlement,
    priorityNumber,
  } = user;

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
