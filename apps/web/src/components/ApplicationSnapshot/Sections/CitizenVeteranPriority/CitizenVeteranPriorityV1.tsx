import { useIntl } from "react-intl";

import type {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
} from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import profileMessages from "~/messages/profileMessages";
import governmentMessages from "~/messages/governmentMessages";

import type { SnapshotProps } from "../types";

export interface CitizenVeteranPrioritySnapshotV1 {
  citizenship: LocalizedCitizenshipStatus | null | undefined;
  armedForcesStatus: LocalizedArmedForcesStatus | null | undefined;
  hasPriorityEntitlement?: boolean | null;
  priorityNumber?: string | null;
}

type CitizenVeteranPriorityV1Props =
  SnapshotProps<CitizenVeteranPrioritySnapshotV1>;

const CitizenVeteranPriorityV1 = ({
  snapshot,
}: CitizenVeteranPriorityV1Props) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const {
    citizenship,
    armedForcesStatus,
    hasPriorityEntitlement,
    priorityNumber,
  } = snapshot;

  const priorityMessage = hasPriorityEntitlement
    ? intl.formatMessage(governmentMessages.yesPriorityEntitlement)
    : intl.formatMessage(governmentMessages.noPriorityEntitlement);

  return (
    <div className="grid gap-6 xs:grid-cols-2 sm:grid-cols-3">
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

export default CitizenVeteranPriorityV1;
