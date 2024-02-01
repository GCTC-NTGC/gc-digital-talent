import React from "react";
import CsvDownloader, { ICsvProps } from "react-csv-downloader";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import getButtonStyles from "../../utils/button/getButtonStyles";
import type { LinkProps } from "./Link";

interface CsvHeader {
  id: string;
  displayName: string;
}

export interface DownloadCsvProps
  extends Pick<
    LinkProps,
    "color" | "mode" | "block" | "type" | "icon" | "fontSize"
  > {
  headers: CsvHeader[];
  data: ICsvProps["datas"];
  fileName: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const DownloadCsv = ({
  color = "primary",
  mode = "solid",
  block = false,
  fontSize = "body",
  disabled,
  icon,
  headers,
  data,
  fileName,
  children,
  ...rest
}: DownloadCsvProps) => {
  return (
    <CsvDownloader
      data-h2-cursor="base(pointer)"
      {...getButtonStyles({ mode, color, block, disabled })}
      {...rest}
      wrapColumnChar='"'
      disabled={disabled}
      columns={headers}
      datas={data}
      filename={fileName}
    >
      <ButtonLinkContent mode={mode} icon={icon} fontSize={fontSize}>
        {children}
      </ButtonLinkContent>
    </CsvDownloader>
  );
};

export default DownloadCsv;
