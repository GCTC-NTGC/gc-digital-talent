import { IntlShape } from "react-intl";

import {
  BasicGovEmployeeProfile,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

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
    .sort((a, b) => (a?.name ?? "").localeCompare(b?.name ?? ""));
}
