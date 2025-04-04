import { useIntl } from "react-intl";
import { JSX } from "react";

import { NominationGroupSidebarFragment as NominationGroupSidebarFragmentType } from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";

// effectively insertBetween(), but specialized specifically for the purpose of unique key values
const commaSeparator = (arr: JSX.Element[]): JSX.Element[] => {
  return arr.reduce<JSX.Element[]>((prev, curr, i) => {
    if (i > 0) {
      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
      prev.push(<span key={i}>, </span>);
    }
    prev.push(curr);
    return prev;
  }, []);
};

interface NominatorListProps {
  talentNominations: NominationGroupSidebarFragmentType["nominations"];
}

const NominatorList = ({ talentNominations }: NominatorListProps) => {
  const intl = useIntl();

  const nominationsSortedByNominator = (talentNominations ?? []).sort(
    (a, b) => {
      return (
        (a.nominator?.lastName ?? "").localeCompare(
          b.nominator?.lastName ?? "",
        ) ||
        (a.nominator?.firstName ?? "").localeCompare(
          b.nominator?.firstName ?? "",
        )
      );
    },
  );
  const nominatorsList = nominationsSortedByNominator.map((nomination) => (
    <span key={nomination.id}>
      {getFullNameLabel(
        nomination.nominator?.firstName,
        nomination.nominator?.lastName,
        intl,
      )}
    </span>
  ));
  const nominatorListCommaSeparated = commaSeparator(nominatorsList);

  return <>{nominatorListCommaSeparated}</>;
};

export default NominatorList;
