import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getSortedNominatorNames } from "~/utils/talentNominations";

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
  const sortedNominators = getSortedNominatorNames(
    unpackMaybes(talentNominations),
    intl,
  );

  return sortedNominators.map((nominator, index) => (
    <span key={nominator.id}>
      {nominator.name}
      {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
      {index + 1 < sortedNominators.length ? ", " : ""}
    </span>
  ));
};

export default NominatorList;
