import React from "react";

import { IconType, Separator } from "@gc-digital-talent/ui";

interface DataRowProps {
  Icon: IconType;
  label: string;
  value: React.ReactNode;
  suffix?: React.ReactNode;
}

const DataRow = ({ Icon, label, value, suffix }: DataRowProps) => (
  <>
    <Separator
      orientation="horizontal"
      decorative
      data-h2-background-color="base(gray)"
      data-h2-margin="base(x1, 0)"
    />
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(flex-start)"
      data-h2-gap="base(0 x.25)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0 x.15)"
        data-h2-flex-shrink="base(0)"
      >
        <Icon data-h2-height="base(1em)" data-h2-width="base(1em)" />
        <span data-h2-font-weight="base(700)">{label}</span>
      </div>
      <span>{value}</span>
      {suffix && (
        <div data-h2-text-align="base(right)" data-h2-flex-grow="base(2)">
          {suffix}
        </div>
      )}
    </div>
  </>
);

export default DataRow;
