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
  const intl = useIntl();

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
          aria-hidden="false"
          aria-label={intl.formatMessage(commonMessages.notApplicable)}
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
          aria-hidden="false"
          aria-label={intl.formatMessage(commonMessages.approved)}
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
          aria-hidden="false"
          aria-label={intl.formatMessage(commonMessages.rejected)}
          {...sharedIconStyling}
        />
      </span>
    );
  }

  return (
    <span>
      <QuestionMarkCircleIcon
        data-h2-color="base(secondary.dark) base:dark(secondary)"
        aria-hidden="false"
        aria-label={intl.formatMessage(commonMessages.inProgress)}
        {...sharedIconStyling}
      />
    </span>
  );
};

export default ComputedIcon;
