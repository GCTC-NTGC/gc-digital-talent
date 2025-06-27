/* eslint-disable formatjs/enforce-plural-rules */
// NOTE: Not really plural, I guess?
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";

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
    <Ul unStyled space="md">
      <li className="flex items-center">
        <ComputedIcon
          count={advancementNominationCount ?? 0}
          decision={advancementDecision?.value}
        />
        {intl.formatMessage(
          {
            defaultMessage:
              "{advancementNominationCount, plural, =0 {Advancement} other {Advancement (#)}}",
            id: "ZzkqoI",
            description:
              "Advancement nominations, conditional rendered off count",
          },
          {
            advancementNominationCount: advancementNominationCount ?? 0,
          },
        )}
      </li>
      <li className="flex items-center">
        <ComputedIcon
          count={lateralMovementNominationCount ?? 0}
          decision={lateralMovementDecision?.value}
        />
        {intl.formatMessage(
          {
            defaultMessage:
              "{lateralMovementNominationCount, plural, =0 {Lateral movement} other {Lateral movement (#)}}",
            id: "q0kxlX",
            description:
              "Lateral movement nominations, conditional rendered off count",
          },
          {
            lateralMovementNominationCount: lateralMovementNominationCount ?? 0,
          },
        )}
      </li>
      <li className="flex items-center">
        <ComputedIcon
          count={developmentProgramsNominationCount ?? 0}
          decision={developmentProgramsDecision?.value}
        />
        {intl.formatMessage(
          {
            defaultMessage:
              "{developmentProgramsNominationCount, plural, =0 {Development} other {Development (#)}}",
            id: "L8iCCj",
            description:
              "Development nominations, conditional rendered off count",
          },
          {
            developmentProgramsNominationCount:
              developmentProgramsNominationCount ?? 0,
          },
        )}
      </li>
    </Ul>
  );
};

export default NominatedForList;
