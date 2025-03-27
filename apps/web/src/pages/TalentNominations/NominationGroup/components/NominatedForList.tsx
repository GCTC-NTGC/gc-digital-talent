import { useIntl } from "react-intl";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import NoSymbolIcon from "@heroicons/react/24/solid/NoSymbolIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationGroupDecision,
} from "@gc-digital-talent/graphql";

interface ComputedIconProps {
  count: number;
  decision?: TalentNominationGroupDecision | null;
}

const ComputedIcon = ({ count, decision }: ComputedIconProps) => {
  const sharedIconStyling = {
    "data-h2-height": "base(x.70)",
    "data-h2-width": "base(x.70)",
    "data-h2-display": "base(inline-block)",
    "data-h2-vertical-align": "base(text-bottom)",
    "data-h2-margin-right": "base(x.25)",
    "data-h2-margin-bottom": "base(x.125)",
  };

  if (count === 0) {
    return (
      <span>
        <NoSymbolIcon
          data-h2-color="base(black.lighter) base:dark(black)"
          {...sharedIconStyling}
        />
      </span>
    );
  }

  if (decision === TalentNominationGroupDecision.Approved) {
    return (
      <span>
        <CheckCircleIcon
          data-h2-color="base(success) base:dark(success.lighter)"
          {...sharedIconStyling}
        />
      </span>
    );
  }

  if (decision === TalentNominationGroupDecision.Rejected) {
    return (
      <span>
        <XCircleIcon
          data-h2-color="base(error) base:dark(error.lighter)"
          {...sharedIconStyling}
        />
      </span>
    );
  }

  return (
    <span>
      <QuestionMarkCircleIcon
        data-h2-color="base(secondary.dark) base:dark(secondary)"
        {...sharedIconStyling}
      />
    </span>
  );
};

const NominationGroupSidebarForList_Fragment = graphql(/* GraphQL */ `
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
