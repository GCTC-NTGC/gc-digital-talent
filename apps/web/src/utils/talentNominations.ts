import type { IntlShape } from "react-intl";

import type { LocalizedString } from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "./nameUtils";

interface NominatorClassification {
  id: string;
  groupAndLevel: string;
}

interface NominatorDepartment {
  id: string;
  name?: LocalizedString | null;
}

interface NominatorProfile {
  firstName?: string | null;
  lastName?: string | null;
  workEmail?: string | null;
  classification?: NominatorClassification | null;
  department?: NominatorDepartment | null;
}

interface NominationsWithNominatorName {
  id: string;
  nominatorFallbackName?: string | null;
  nominator?: NominatorProfile | null;
}

export function getSortedNominatorNames(
  talentNominations: NominationsWithNominatorName[],
  intl: IntlShape,
) {
  return unpackMaybes(talentNominations)
    .map((nomination) => {
      let name = nomination.nominatorFallbackName;
      if (nomination.nominator) {
        name = getFullNameLabel(
          nomination.nominator.firstName,
          nomination.nominator.lastName,
          intl,
        );
      }

      return {
        id: nomination.id,
        name,
      };
    })
    .filter((nominator) => !!nominator.name)
    .sort(sortAlphaBy((nominator) => nominator.name));
}

/**
 * Get a nominator's name by first checking nominator field then nominator fallback name
 */
export function getNominatorName(
  nominator: NominatorProfile | null | undefined,
  nominatorFallbackName: string | null | undefined,
  intl: IntlShape,
): string {
  if (nominator) {
    return getFullNameLabel(nominator.firstName, nominator.lastName, intl);
  }
  return (
    nominatorFallbackName ?? intl.formatMessage(commonMessages.notProvided)
  );
}

/**
 * Get a nominator's work email by first checking nominator field then nominator fallback work email
 */
export function getNominatorWorkEmail(
  nominator: NominatorProfile | null | undefined,
  nominatorFallbackWorkEmail: string | null | undefined,
  intl: IntlShape,
): string {
  if (nominator) {
    return (
      nominator.workEmail ?? intl.formatMessage(commonMessages.notProvided)
    );
  }
  return (
    nominatorFallbackWorkEmail ?? intl.formatMessage(commonMessages.notProvided)
  );
}

/**
 * Get a nominator's classification by first checking nominator field then nominator fallback classification
 */
export function getNominatorClassification(
  nominator: NominatorProfile | null | undefined,
  nominatorFallbackClassification: NominatorClassification | null | undefined,
): NominatorClassification | null {
  if (nominator) {
    return nominator.classification ?? null;
  }
  return nominatorFallbackClassification ?? null;
}

/**
 * Get a nominator's department by first checking nominator field then nominator fallback department
 */
export function getNominatorDepartment(
  nominator: NominatorProfile | null | undefined,
  nominatorFallbackDepartment: NominatorDepartment | null | undefined,
): NominatorDepartment | null {
  if (nominator) {
    return nominator.department ?? null;
  }
  return nominatorFallbackDepartment ?? null;
}
