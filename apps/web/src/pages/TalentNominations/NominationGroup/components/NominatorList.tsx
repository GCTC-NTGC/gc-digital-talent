import { useIntl } from "react-intl";
import { Fragment } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { UNICODE_CHAR } from "@gc-digital-talent/ui";

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

  return (
    <>
      {nominationsSortedByNominator.map((nomination, index) => (
        <Fragment key={nomination.id}>
          {index > 0 && (
            <span className="mr-1" aria-hidden="true">
              {UNICODE_CHAR.COMMA}
            </span>
          )}
          <NominatorInfoDialog nominationQuery={nomination} />
        </Fragment>
      ))}
    </>
  );
};

export default NominatorList;
