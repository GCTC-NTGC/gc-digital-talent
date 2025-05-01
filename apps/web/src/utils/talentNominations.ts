import { IntlShape } from "react-intl";

import {
  BasicGovEmployeeProfile,
  Classification,
  Department,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "./nameUtils";

interface NominationsWithNominatorName {
  id: Scalars["UUID"]["output"];
  nominatorFallbackName?: Maybe<string>;
  nominator?: Maybe<Pick<BasicGovEmployeeProfile, "firstName" | "lastName">>;
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
  nominator:
    | Pick<BasicGovEmployeeProfile, "firstName" | "lastName">
    | null
    | undefined,
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
  nominator: Pick<BasicGovEmployeeProfile, "workEmail"> | null | undefined,
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
  nominator: Pick<BasicGovEmployeeProfile, "classification"> | null | undefined,
  nominatorFallbackClassification: Maybe<Classification> | undefined,
): Classification | null {
  if (nominator) {
    return nominator.classification ?? null;
  }
  return nominatorFallbackClassification ?? null;
}

/**
 * Get a nominator's department by first checking nominator field then nominator fallback department
 */
export function getNominatorDepartment(
  nominator: Pick<BasicGovEmployeeProfile, "department"> | null | undefined,
  nominatorFallbackDepartment: Maybe<Department> | undefined,
): Department | null {
  if (nominator) {
    return nominator.department ?? null;
  }
  return nominatorFallbackDepartment ?? null;
}
