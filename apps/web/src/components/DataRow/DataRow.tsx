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
    <div className="flex flex-col items-start gap-1.5 xs:flex-row xs:items-center">
      <div className="shrink-0">
        <span className="font-bold">{label}</span>
      </div>
      <span className="flex items-center gap-x-1.5">
        <span>{value}</span>
        {suffix}
      </span>
    </div>
  </>
);

export default DataRow;
