import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import ComputedIcon from "./ComputedIcon";

export const NominationGroupSidebarForList_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupSidebarForList on TalentNominationGroup {
    advancementNominationCount
    advancementDecision {
      value
    }
    lateralMovementNominationCount
    lateralMovementDecision {
      value
    }
    developmentProgramsNominationCount
    developmentProgramsDecision {
      value
    }
  }
`);

interface NominatedForListProps {
  nominationGroupSidebarForListQuery: FragmentType<
    typeof NominationGroupSidebarForList_Fragment
  >;
}

const NominatedForList = ({
  nominationGroupSidebarForListQuery,
}: NominatedForListProps) => {
  const intl = useIntl();

  const nominationGroupSidebarForList = getFragment(
    NominationGroupSidebarForList_Fragment,
    nominationGroupSidebarForListQuery,
  );

  const {
    advancementNominationCount,
    advancementDecision,
    lateralMovementNominationCount,
    lateralMovementDecision,
    developmentProgramsNominationCount,
    developmentProgramsDecision,
  } = nominationGroupSidebarForList;

  return (
    <ul data-h2-padding="base(0)" data-h2-list-style="base(none)">
      <li>
        <ComputedIcon
          count={advancementNominationCount ?? 0}
          decision={advancementDecision?.value}
        />
        {intl.formatMessage(commonMessages.advancement)}
        {!!advancementNominationCount && advancementNominationCount !== 0
          ? // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            ` (${advancementNominationCount})`
          : null}
      </li>
      <li>
        <ComputedIcon
          count={lateralMovementNominationCount ?? 0}
          decision={lateralMovementDecision?.value}
        />
        {intl.formatMessage(commonMessages.lateralMovement)}
        {!!lateralMovementNominationCount &&
        lateralMovementNominationCount !== 0
          ? // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            ` (${lateralMovementNominationCount})`
          : null}
      </li>
      <li>
        <ComputedIcon
          count={developmentProgramsNominationCount ?? 0}
          decision={developmentProgramsDecision?.value}
        />
        {intl.formatMessage(commonMessages.development)}
        {!!developmentProgramsNominationCount &&
        developmentProgramsNominationCount !== 0
          ? // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            ` (${developmentProgramsNominationCount})`
          : null}
      </li>
    </ul>
  );
};

export default NominatedForList;
