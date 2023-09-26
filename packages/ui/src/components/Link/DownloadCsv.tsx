import React from "react";
import { CSVLink } from "react-csv";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import getButtonStyle from "../../hooks/Button/getButtonStyles";
import type { LinkProps } from "./Link";

interface CsvHeader {
  key: string;
  label: string;
}

export interface DownloadCsvProps
  extends Pick<LinkProps, "color" | "mode" | "block" | "type" | "icon"> {
  headers: CsvHeader[];
  data: Record<string, string>[];
  fileName: string;
  children: React.ReactNode;
}

const DownloadCsv = ({
  color = "primary",
  mode = "solid",
  block = false,
  icon,
  headers,
  data,
  fileName,
  children,
  ...rest
}: DownloadCsvProps) => {
  return (
    <CSVLink
      {...getButtonStyle({ mode, color, block })}
      {...rest}
      target="_blank"
      headers={headers}
      data={data}
      filename={fileName}
    >
      <ButtonLinkContent mode={mode} icon={icon}>
        {children}
      </ButtonLinkContent>
    </CSVLink>
  );
};

export default DownloadCsv;
