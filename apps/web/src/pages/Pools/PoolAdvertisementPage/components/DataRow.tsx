import React from "react";

import { Separator } from "@gc-digital-talent/ui";

interface DataRowProps {
  Icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: React.ReactNode;
  suffix?: React.ReactNode;
}

const DataRow = ({ Icon, label, value, suffix }: DataRowProps) => (
  <>
    <Separator
      orientation="horizontal"
      decorative
      data-h2-background-color="base(gray.lighter)"
      data-h2-margin="base(x1, 0)"
    />
    <div
      {...(suffix
        ? {
            "data-h2-display": "base(grid)",
            "data-h2-grid-template-columns": "base(1fr) l-tablet(1fr 1fr)",
            "data-h2-gap": "base(x1)",
          }
        : {})}
    >
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
      </div>
      {suffix && <div data-h2-text-align="base(right)">{suffix}</div>}
    </div>
  </>
);

export default DataRow;
