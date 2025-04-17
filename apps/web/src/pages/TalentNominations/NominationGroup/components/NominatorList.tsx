import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";

const NominatorList_Fragment = graphql(/** GraphQL */ `
  fragment NominatorList on TalentNomination {
    id
    nominatorFallbackName
    nominator {
      firstName
      lastName
    }
  }
`);

interface NominatorListProps {
  query?: FragmentType<typeof NominatorList_Fragment>[];
}

const NominatorList = ({ query }: NominatorListProps) => {
  const intl = useIntl();
  const talentNominations = getFragment(NominatorList_Fragment, query);

  const nominationsSortedByNominator = unpackMaybes(talentNominations)
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

  return nominationsSortedByNominator.map((nominator, index) => (
    <span key={nominator.id}>
      {nominator.name}
      {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
      {index + 1 < nominationsSortedByNominator.length ? ", " : ""}
    </span>
  ));
};

export default NominatorList;
