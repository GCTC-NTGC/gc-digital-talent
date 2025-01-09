import { ReactNode } from "react";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import { HydrogenAttributes } from "../../types";

// an icon pinned to the top-right to show the completion state
const StateIcon = ({ state }: { state: BaseItemProps["state"] }) => {
  const commonStyles: HydrogenAttributes = {
    "data-h2-width": "base(x0.75)",
    "data-h2-height": "base(x0.75)",
    "data-h2-position": "base(absolute)",
    "data-h2-location": "base(x0.75, x0.75, auto, auto)",
  };

  if (state === "incomplete") {
    return (
      <ExclamationCircleIcon
        data-h2-color="base(error) base:dark(error.lighter)"
        {...commonStyles}
      />
    );
  }
  if (state === "complete") {
    return (
      <CheckCircleIcon
        data-h2-color="base(success) base:dark(success.lighter)"
        {...commonStyles}
      />
    );
  }
  return null;
};

export interface BaseItemProps {
  title: ReactNode;
  accessibleLabel: string;
  description: ReactNode;
  state?: "incomplete" | "complete";
}

const BaseItem = ({
  title,
  accessibleLabel,
  description,
  state,
}: BaseItemProps) => {
  const intl = useIntl();
  const extraStateStyles =
    state === "incomplete"
      ? {
          // should match the absolute positioning of the center of the state icon (x0.75 + (x0.75/2))
          "data-h2-background":
            "base(radial-gradient(circle x5 at top x1.125 right x1.125, error.10, foreground))",
        }
      : {};

  let combinedLabel;
  switch (state) {
    case "incomplete":
      combinedLabel = `${accessibleLabel} (${intl.formatMessage(commonMessages.incomplete)})`;
      break;
    case "complete":
      combinedLabel = `${accessibleLabel} (${intl.formatMessage(commonMessages.complete)})`;
      break;
    default:
      combinedLabel = accessibleLabel;
  }

  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-padding="base(x1) l-tablet(x1 x1.5)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x0.15)"
      data-h2-border-bottom="base:all:selectors[:not(:last-child)](1px solid gray.light)"
      data-h2-border-radius="base:all:selectors[:last-child](0 0 rounded rounded)"
      // make the containing block for state icon
      data-h2-position="base(relative)"
      aria-label={combinedLabel}
      role="listitem"
      {...extraStateStyles}
    >
      <StateIcon state={state} />
      <div
        // icon extends margin + icons size: x0.75 + x0.75 = x1.5
        // item margin is base(x1) l-tablet(x1.5)
        data-h2-padding-right="base(x0.5) l-tablet(0)"
      >
        {title}
      </div>
      <p data-h2-color="base(black.light)" data-h2-font-size="base(caption)">
        {description}
      </p>
    </div>
  );
};

export default BaseItem;
