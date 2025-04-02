import { IntlShape } from "react-intl";
import { JSX } from "react";

import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import {
  TalentEventNominationsTableFragment as TalentEventNominationsTableFragmentType,
  TalentNominationGroupStatus,
} from "@gc-digital-talent/graphql";
import { Chip } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";

import { TalentNominator } from "./types";

export function nominationsToNominators(
  nominations: TalentEventNominationsTableFragmentType["nominations"],
): TalentNominator[] {
  const nominationsFiltered = nominations?.filter(notEmpty) ?? [];
  const nominators = nominationsFiltered.map(
    (nomination) => nomination?.nominator,
  );
  const nominatorsFiltered = nominators?.filter(notEmpty) ?? [];

  return nominatorsFiltered;
}

export function nominatorsAccessor(
  nominators: TalentNominator[],
  intl: IntlShape,
): string {
  const nominatorsNamesArray = nominators.map((nominator) =>
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
