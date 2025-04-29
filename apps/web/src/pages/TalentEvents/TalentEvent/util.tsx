import { IntlShape } from "react-intl";
import { JSX } from "react";

import {
  TalentEventNominationsTableFragment as TalentEventNominationsTableFragmentType,
  TalentNominationGroupStatus,
} from "@gc-digital-talent/graphql";
import { Chip, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import messages from "~/messages/talentNominationMessages";

export function statusCell(
  status: TalentEventNominationsTableFragmentType["status"],
): JSX.Element | null {
  if (!status?.value || !status?.label?.localized) {
    return null;
  }

  if (status.value === TalentNominationGroupStatus.Approved) {
    return <Chip color="success">{status.label.localized}</Chip>;
  }

  if (status.value === TalentNominationGroupStatus.PartiallyApproved) {
    return <Chip color="success">{status.label.localized}</Chip>;
  }

  if (status.value === TalentNominationGroupStatus.InProgress) {
    return <Chip color="primary">{status.label.localized}</Chip>;
  }

  if (status.value === TalentNominationGroupStatus.Rejected) {
    return <Chip color="error">{status.label.localized}</Chip>;
  }

  return null;
}

export const nomineeNameCell = (
  eventId: string,
  nominationGroupId: string,
  nomineeName: string,
  nominationIds: string[],
  paths: ReturnType<typeof useRoutes>,
) => {
  return (
    <Link
      href={paths.talentNominationGroup(eventId, nominationGroupId)}
      state={{ nominationIds }}
    >
      {nomineeName}
    </Link>
  );
};

export function typesAccessor(
  advancementNominationCount: number,
  lateralMovementNominationCount: number,
  developmentProgramsNominationCount: number,
  intl: IntlShape,
): string {
  let arrayOfTypes: string[] = [];

  if (advancementNominationCount > 0) {
    arrayOfTypes = [
      ...arrayOfTypes,
      intl.formatMessage(messages.nominateForAdvancement),
    ];
  }

  if (lateralMovementNominationCount > 0) {
    arrayOfTypes = [
      ...arrayOfTypes,
      intl.formatMessage(messages.nominateForLateralMovement),
    ];
  }

  if (developmentProgramsNominationCount > 0) {
    arrayOfTypes = [...arrayOfTypes, intl.formatMessage(messages.development)];
  }

  return arrayOfTypes.join(", ");
}
