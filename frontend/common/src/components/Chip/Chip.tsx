import React from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import Pill from "../Pill";

import "./chip.css";

export interface ChipProps extends React.HTMLProps<HTMLElement> {
  /** The style type of the element. */
  color: "primary" | "secondary" | "neutral";
  /** The style mode of the element. */
  mode: "solid" | "outline";
  /** Handler for clicking the dismiss button in the chip */
  onDismiss?: React.MouseEventHandler<Element>;
  /** Text for inside the chip */
  label: string;
}

type ChipColor = "primary" | "secondary" | "neutral";

const colorMap: Record<
  ChipColor,
  Record<"solid" | "outline", Record<string, string>>
> = {
  primary: {
    solid: {
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-color": "base(dark.dt-primary)",
    },
  },
  secondary: {
    solid: {
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-color": "base(dark.dt-secondary)",
    },
  },
  neutral: {
    solid: {
      "data-h2-color": "base(dt-white)",
    },
    outline: {
      "data-h2-color": "base(dark.dt-gray)",
    },
  },
};

const ChipDismiss = (props: React.ComponentProps<"button">) => (
  <button
    type="button"
    data-h2-background-color="base(transparent)"
    data-h2-border="base(none)"
    data-h2-cursor="base(pointer)"
    data-h2-padding="base(0)"
    data-h2-radius="base(m)"
    data-h2-shadow="base(none) base:hover(s)"
    {...props}
  />
);

const Chip: React.FC<ChipProps> = ({
  color,
  mode,
  onDismiss,
  label,
}): React.ReactElement => {
  const intl = useIntl();
  const wrapperProps = onDismiss
    ? {
        className: `Chip__Dismiss Chip__Dismiss--${color}`,
        onClick: onDismiss,
        "aria-label": intl.formatMessage(
          {
            defaultMessage: "Remove {label}",
            id: "rsxrMs",
            description: "Button text for a dismissible chip",
          },
          {
            label,
          },
        ),
      }
    : {};

  const Wrapper = onDismiss ? ChipDismiss : React.Fragment;

  return (
    <Wrapper {...wrapperProps}>
      <Pill
        color={color}
        mode={mode}
        role="listitem"
        data-h2-padding="base(x.25, x.5)"
      >
        {label}
        {onDismiss && (
          <XCircleIcon
            data-h2-width="base(1rem)"
            data-h2-margin="base(0, 0, 0, x.25)"
            data-h2-vertical-align="base(middle)"
          />
        )}
      </Pill>
    </Wrapper>
  );
};

export default Chip;
