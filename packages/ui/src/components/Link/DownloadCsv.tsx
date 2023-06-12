import React from "react";
import { CSVLink } from "react-csv";

import type { LinkProps } from "./Link";
import useCommonButtonLinkStyles from "../../hooks/useCommonButtonLinkStyles";

interface CsvHeader {
  key: string;
  label: string;
}

export interface DownloadCsvProps
  extends Pick<LinkProps, "color" | "mode" | "block" | "type"> {
  headers: CsvHeader[];
  data: Record<string, string>[];
  fileName: string;
  children: React.ReactNode;
}

const DownloadCsv = ({
  color = "primary",
  mode = "solid",
  block,
  headers,
  data,
  fileName,
  children,
  ...rest
}: DownloadCsvProps) => {
  const styles = useCommonButtonLinkStyles({
    color,
    mode,
    block,
  });

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
