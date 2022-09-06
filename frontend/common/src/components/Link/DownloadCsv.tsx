import React from "react";
import { CSVLink } from "react-csv";

import useCommonLinkStyles from "./useCommonLinkStyles";
import type { LinkProps } from "./Link";

interface CsvHeader {
  key: string;
  label: string;
}

export interface DownloadCsvProps
  extends Pick<LinkProps, "color" | "mode" | "block" | "type" | "disabled"> {
  headers: CsvHeader[];
  data: Record<string, string>[];
  fileName: string;
  children: React.ReactNode;
}

const DownloadCsv = ({
  color,
  disabled,
  mode,
  type,
  block,
  headers,
  data,
  fileName,
  children,
  ...rest
}: DownloadCsvProps) => {
  const styles = useCommonLinkStyles({ color, disabled, mode, block, type });

  return (
    <CSVLink
      {...styles}
      {...rest}
      target="_blank"
      headers={headers}
      data={data}
      filename={fileName}
    >
      {children}
    </CSVLink>
  );
};

export default DownloadCsv;
