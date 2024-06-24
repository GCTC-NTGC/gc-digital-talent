import {
  EvaluatedLanguageAbility,
  LocalizedEnumString,
  Maybe,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import { localizedEnumHasValue, unpackMaybes } from "./util";

function sortLocalizedEnum(
  order: string[],
  localizedEnum?: Maybe<Maybe<LocalizedEnumString>[]>,
): LocalizedEnumString[] {
  return unpackMaybes(localizedEnum)
    .filter(localizedEnumHasValue)
    .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
}

const evaluatedAbilityItemsSortOrder: string[] = [
  EvaluatedLanguageAbility.P,
  EvaluatedLanguageAbility.E,
  EvaluatedLanguageAbility.C,
  EvaluatedLanguageAbility.B,
  EvaluatedLanguageAbility.A,
  EvaluatedLanguageAbility.X,
  EvaluatedLanguageAbility.NotAssessed,
];

export function sortLocalizedEvaluatedLanguageAbility(
  languageAbilities?: Maybe<Maybe<LocalizedEnumString>[]>,
): LocalizedEnumString[] {
  return sortLocalizedEnum(evaluatedAbilityItemsSortOrder, languageAbilities);
}

const sortedWorkRegions: string[] = [
  WorkRegion.Telework,
  WorkRegion.NationalCapital,
  WorkRegion.Atlantic,
  WorkRegion.Quebec,
  WorkRegion.Ontario,
  WorkRegion.North,
  WorkRegion.Prairie,
  WorkRegion.BritishColumbia,
];

export function sortWorkRegions(
  workRegions: Maybe<Maybe<LocalizedEnumString>[]>,
): LocalizedEnumString[] {
  return sortLocalizedEnum(sortedWorkRegions, workRegions);
}
