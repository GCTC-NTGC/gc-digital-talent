import { useIntl } from "react-intl";

import { NominationGroupSidebarFragment as NominationGroupSidebarFragmentType } from "@gc-digital-talent/graphql";
import { insertBetween } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";

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
  const nominatorListCommaSeparated = insertBetween(
    // eslint-disable-next-line formatjs/no-literal-string-in-jsx
    <span>, </span>,
    nominatorsList,
  );

  return <>{nominatorListCommaSeparated}</>;
};

export default NominatorList;
