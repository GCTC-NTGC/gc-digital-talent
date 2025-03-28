import { useIntl } from "react-intl";

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
        {intl.formatMessage(
          {
            defaultMessage:
              "{advancementNominationCount, plural, =0 {Advancement} other {Advancement ({advancementNominationCount, number})}}",
            id: "fOilMx",
            description:
              "Advancement nominations, conditional rendered off count",
          },
          {
            advancementNominationCount: advancementNominationCount ?? 0,
          },
        )}
      </li>
      <li>
        <ComputedIcon
          count={lateralMovementNominationCount ?? 0}
          decision={lateralMovementDecision?.value}
        />
        {intl.formatMessage(
          {
            defaultMessage:
              "{lateralMovementNominationCount, plural, =0 {Lateral movement} other {Lateral movement ({lateralMovementNominationCount, number})}}",
            id: "4ozix3",
            description:
              "Lateral movement nominations, conditional rendered off count",
          },
          {
            lateralMovementNominationCount: lateralMovementNominationCount ?? 0,
          },
        )}
      </li>
      <li>
        <ComputedIcon
          count={developmentProgramsNominationCount ?? 0}
          decision={developmentProgramsDecision?.value}
        />
        {intl.formatMessage(
          {
            defaultMessage:
              "{developmentProgramsNominationCount, plural, =0 {Development} other {Development ({developmentProgramsNominationCount, number})}}",
            id: "+UTd4G",
            description:
              "Development nominations, conditional rendered off count",
          },
          {
            developmentProgramsNominationCount:
              developmentProgramsNominationCount ?? 0,
          },
        )}
      </li>
    </ul>
  );
};

export default NominatedForList;
