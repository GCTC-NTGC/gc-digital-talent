import { ReactNode } from "react";

import { Separator } from "@gc-digital-talent/ui";

interface DataRowProps {
  label: string;
  value: ReactNode;
  suffix?: ReactNode;
  hideSeparator?: boolean;
}

const DataRow = ({
  label,
  value,
  suffix,
  hideSeparator = false,
}: DataRowProps) => (
  <>
    {!hideSeparator && <Separator space="sm" />}
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-align-items="base(flex-start) p-tablet(center)"
      data-h2-gap="base(x.25)"
    >
      <div data-h2-flex-shrink="base(0)">
        <span data-h2-font-weight="base(700)">{label}</span>
      </div>
      <span
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0 x.25)"
      >
        <span>{value}</span>
        {suffix}
      </span>
    </div>
  </>
);

export default DataRow;
