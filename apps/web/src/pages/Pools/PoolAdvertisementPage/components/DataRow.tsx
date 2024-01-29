import React from "react";

import { IconType, Separator } from "@gc-digital-talent/ui";

interface DataRowProps {
  label: string;
  value: React.ReactNode;
  suffix?: React.ReactNode;
  hideSeparator?: boolean;
}

const DataRow = ({
  label,
  value,
  suffix,
  hideSeparator = false,
}: DataRowProps) => (
  <>
    {!hideSeparator && (
      <Separator
        orientation="horizontal"
        decorative
        data-h2-background-color="base(gray)"
        data-h2-margin="base(x1, 0)"
      />
    )}
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(flex-end)"
      data-h2-gap="base(0 x.25)"
    >
      <div data-h2-flex-shrink="base(0)">
        <span data-h2-font-weight="base(700)">{label}</span>
      </div>
      <span>{value}</span>
      {suffix}
    </div>
  </>
);

export default DataRow;
