import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import governmentMessages from "~/messages/governmentMessages";

export const PriorityEntitlementDisplay_Fragment = graphql(/** GraphQL */ `
  fragment PriorityEntitlementDisplay on User {
    hasPriorityEntitlement
    priorityNumber
  }
`);

interface DisplayProps {
  query: FragmentType<typeof PriorityEntitlementDisplay_Fragment>;
}

const Display = ({ query }: DisplayProps) => {
  const intl = useIntl();
  const user = getFragment(PriorityEntitlementDisplay_Fragment, query);
  const { hasPriorityEntitlement, priorityNumber } = user;

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const priorityMessage = hasPriorityEntitlement
    ? intl.formatMessage(governmentMessages.yesPriorityEntitlement)
    : intl.formatMessage(governmentMessages.noPriorityEntitlement);

  return (
    <div className="flex flex-col gap-y-6">
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
