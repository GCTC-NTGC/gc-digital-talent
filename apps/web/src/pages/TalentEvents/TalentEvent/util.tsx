import { IntlShape } from "react-intl";
import { JSX } from "react";

import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  TalentEventNominationsTableFragment as TalentEventNominationsTableFragmentType,
  TalentNominationGroupStatus,
} from "@gc-digital-talent/graphql";
import { Chip, Link } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import messages from "~/messages/talentNominationMessages";

import { TalentNominator } from "./types";

export function nominationsToNominators(
  nominations: TalentEventNominationsTableFragmentType["nominations"],
): TalentNominator[] {
  const nominationsFiltered = unpackMaybes(nominations);
  const nominators = nominationsFiltered.map(
    (nomination) => nomination?.nominator,
  );

  return unpackMaybes(nominators);
}

export function nominatorsAccessor(
  nominators: TalentNominator[],
  intl: IntlShape,
): string {
  const nominatorsSorted = nominators.sort((a, b) => {
    return (
      (a.lastName ?? "").localeCompare(b.lastName ?? "") ||
      (a.firstName ?? "").localeCompare(b.firstName ?? "")
    );
  });

  const nominatorsNamesArray = nominatorsSorted.map((nominator) =>
    getFullNameLabel(nominator?.firstName, nominator?.lastName, intl),
  );
  const uniqueNamesToDisplay = uniqueItems(nominatorsNamesArray);

  return uniqueNamesToDisplay.join(", ");
}

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
  paths: ReturnType<typeof useRoutes>,
) => {
  return (
    <Link href={paths.talentNominationGroupProfile(eventId, nominationGroupId)}>
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
