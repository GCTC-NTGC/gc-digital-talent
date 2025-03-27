import { useIntl } from "react-intl";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import NoSymbolIcon from "@heroicons/react/24/solid/NoSymbolIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import { TalentNominationGroupDecision } from "@gc-digital-talent/graphql";

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

interface NominatedForListProps {
  advancementCount: number;
  advancementDecision?: TalentNominationGroupDecision;
  lateralMovementCount: number;
  lateralMovementDecision?: TalentNominationGroupDecision;
  developmentProgramCount: number;
  developmentProgramDecision?: TalentNominationGroupDecision;
}

const NominatedForList = ({
  advancementCount,
  advancementDecision,
  lateralMovementCount,
  lateralMovementDecision,
  developmentProgramCount,
  developmentProgramDecision,
}: NominatedForListProps) => {
  const intl = useIntl();

  return (
    <ul data-h2-padding="base(0)" data-h2-list-style="base(none)">
      <li>
        <ComputedIcon count={advancementCount} decision={advancementDecision} />
        {intl.formatMessage(commonMessages.advancement)}
        {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
        {advancementCount === 0 ? null : ` (${advancementCount})`}
      </li>
      <li>
        <ComputedIcon
          count={lateralMovementCount}
          decision={lateralMovementDecision}
        />
        {intl.formatMessage(commonMessages.lateralMovement)}
        {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
        {lateralMovementCount === 0 ? null : ` (${lateralMovementCount})`}
      </li>
      <li>
        <ComputedIcon
          count={developmentProgramCount}
          decision={developmentProgramDecision}
        />
        {intl.formatMessage(commonMessages.development)}
        {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
        {developmentProgramCount === 0 ? null : ` (${developmentProgramCount})`}
      </li>
    </ul>
  );
};

export default NominatedForList;
