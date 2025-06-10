import CsvDownloader, { ICsvProps } from "react-csv-downloader";
import { ReactNode } from "react";

import type { LinkProps } from "./Link";
import { btn } from "../../utils/btnStyles";

interface CsvHeader {
  id: string;
  displayName: string;
}

export interface DownloadCsvProps
  extends Pick<
    LinkProps,
    "color" | "mode" | "block" | "type" | "icon" | "size"
  > {
  headers: CsvHeader[];
  data: ICsvProps["datas"];
  fileName: string;
  children: ReactNode;
  disabled?: boolean;
}

const DownloadCsv = ({
  color = "primary",
  mode = "solid",
  block = false,
  size = "md",
  disabled,
  icon,
  headers,
  data,
  fileName,
  children,
  ...rest
}: DownloadCsvProps) => {
  const Icon = icon;
  const { base, label, leadingIcon } = btn({
    color,
    mode,
    block,
    size,
    disabled,
  });
  return (
    <CsvDownloader
      className={base()}
      {...rest}
      wrapColumnChar='"'
      disabled={disabled}
      columns={headers}
      datas={data}
      filename={fileName}
    >
      {Icon && <Icon className={leadingIcon()} />}
      <span className={label()}>{children}</span>
    </CsvDownloader>
  );
};

export default DownloadCsv;
