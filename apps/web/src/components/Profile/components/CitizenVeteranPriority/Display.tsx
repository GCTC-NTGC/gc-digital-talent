import { useIntl } from "react-intl";

import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
} from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import governmentMessages from "~/messages/governmentMessages";

const CitizenVeteranPriorityDisplay_Fragment = graphql(/** GraphQL */ `
  fragment CitizenVeteranPriorityDisplay on User {
    hasPriorityEntitlement
    priorityNumber
    citizenship {
      value
      label {
        localized
      }
    }
    armedForcesStatus {
      value
      label {
        localized
      }
    }
  }
`);

interface DisplayProps {
  query: FragmentType<typeof CitizenVeteranPriorityDisplay_Fragment>;
}

const Display = ({ query }: DisplayProps) => {
  const intl = useIntl();
  const user = getFragment(CitizenVeteranPriorityDisplay_Fragment, query);
  const {
    hasPriorityEntitlement,
    priorityNumber,
    citizenship,
    armedForcesStatus,
  } = user;

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const priorityMessage = hasPriorityEntitlement
    ? intl.formatMessage(governmentMessages.yesPriorityEntitlement)
    : intl.formatMessage(governmentMessages.noPriorityEntitlement);

  return (
    <div className="flex flex-col gap-y-6">
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The following information is used by recruitment teams and hiring managers to evaluate eligibility during a hiring process.",
          id: "pNCpED",
          description: "Preamble for citizen/veteran/priority edit form",
        })}
      </p>
      <FieldDisplay
        hasError={!citizenship}
        label={intl.formatMessage(profileMessages.citizenship)}
        className="xs:col-span-2 sm:col-span-3"
      >
        {citizenship?.value
          ? intl.formatMessage(getCitizenshipStatusesProfile(citizenship.value))
          : notProvided}
      </FieldDisplay>

      <FieldDisplay
        hasError={empty(armedForcesStatus)}
        label={intl.formatMessage(profileMessages.veteranStatus)}
        className="xs:col-span-2 sm:col-span-3"
      >
        {armedForcesStatus?.value
          ? intl.formatMessage(
              getArmedForcesStatusesProfile(armedForcesStatus.value, false),
            )
          : notProvided}
      </FieldDisplay>

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
