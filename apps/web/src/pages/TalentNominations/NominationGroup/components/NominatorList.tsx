import { useIntl } from "react-intl";
import { JSX } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getNominatorName } from "~/utils/talentNominations";

import NominatorInfoDialog from "./NominatorInfoDialog";

const NominatorList_Fragment = graphql(/** GraphQL */ `
  fragment NominatorList on TalentNomination {
    ...NominatorInfoDialog_Nomination
    id
    nominatorFallbackName
    nominator {
      firstName
      lastName
    }
  }
`);

// effectively insertBetween(), but specialized specifically for the purpose of unique key values
const commaSeparator = (arr: JSX.Element[]): JSX.Element[] => {
  return arr.reduce<JSX.Element[]>((prev, curr, i) => {
    if (i > 0) {
      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
      prev.push(<span key={i}> , </span>);
    }
    prev.push(curr);
    return prev;
  }, []);
};

interface NominatorListProps {
  query?: FragmentType<typeof NominatorList_Fragment>[];
}

const NominatorList = ({ query }: NominatorListProps) => {
  const intl = useIntl();

  const talentNominations = unpackMaybes(
    getFragment(NominatorList_Fragment, query),
  );

  const nominationsSortedByNominator = talentNominations.sort((a, b) => {
    const aName = getNominatorName(a.nominator, a.nominatorFallbackName, intl);
    const bName = getNominatorName(b.nominator, b.nominatorFallbackName, intl);

    return aName.localeCompare(bName);
  });

  const nominatorsList = nominationsSortedByNominator.map((nomination) => (
    <NominatorInfoDialog key={nomination.id} nominationQuery={nomination} />
  ));
  const nominatorListCommaSeparated = commaSeparator(nominatorsList);

  return <>{nominatorListCommaSeparated}</>;
};

export default NominatorList;
