import React from "react";
import { XCircleIcon } from "@heroicons/react/outline";
import Pill from "../Pill";

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

const colorMap: Record<
  "primary" | "secondary" | "neutral",
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

const Chip: React.FC<ChipProps> = ({
  color,
  mode,
  onDismiss,
  label,
}): React.ReactElement => {
  return (
    <Pill
      color={color}
      mode={mode}
      role="listitem"
      data-h2-padding="base(x.125, x.25)"
    >
      {label}
      {onDismiss && (
        <XCircleIcon
          style={{ width: "1.25rem", cursor: "pointer" }}
          data-h2-margin="base(0, 0, 0, x.125)"
          {...colorMap[color][mode]}
          role="button"
          onClick={onDismiss}
        />
      )}
    </Pill>
  );
};

export default Chip;
