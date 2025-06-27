import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import NoSymbolIcon from "@heroicons/react/24/solid/NoSymbolIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import { TalentNominationGroupDecision } from "@gc-digital-talent/graphql";

const iconStyles = tv({
  base: "mr-1.5 mb-1 inline-block size-4 align-text-bottom",
  variants: {
    color: {
      black: "text-gray-600 dark:text-gray-200",
      success: "text-success dark:text-success-200",
      error: "text-error dark:text-error-200",
      secondary: "text-secondary-500 dark:text-secondary",
    },
  },
});

interface ComputedIconProps {
  count: number;
  decision?: TalentNominationGroupDecision | null;
}

const ComputedIcon = ({ count, decision }: ComputedIconProps) => {
  const intl = useIntl();

  if (count === 0) {
    return (
      <NoSymbolIcon
        aria-hidden="false"
        aria-label={intl.formatMessage(commonMessages.notApplicable)}
        className={iconStyles({ color: "black" })}
      />
    );
  }

  if (decision === TalentNominationGroupDecision.Approved) {
    return (
      <CheckCircleIcon
        className={iconStyles({ color: "success" })}
        aria-hidden="false"
        aria-label={intl.formatMessage(commonMessages.approved)}
      />
    );
  }

  if (decision === TalentNominationGroupDecision.Rejected) {
    return (
      <XCircleIcon
        className={iconStyles({ color: "error" })}
        aria-hidden="false"
        aria-label={intl.formatMessage(commonMessages.notSupported)}
      />
    );
  }

  return (
    <QuestionMarkCircleIcon
      className={iconStyles({ color: "secondary" })}
      aria-hidden="false"
      aria-label={intl.formatMessage(commonMessages.inProgress)}
    />
  );
};

export default ComputedIcon;
