import React from "react";
import { CSVLink } from "react-csv";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import getBaseStyle from "../../hooks/Button/getButtonBaseStyle";
import getBackgroundColor from "../../hooks/Button/getButtonBackgroundColor";
import getBorderColor from "../../hooks/Button/getButtonBorderColor";
import getDisplay from "../../hooks/Button/getButtonDisplay";
import getFontColor from "../../hooks/Button/getButtonFontColor";
import getFontWeight from "../../hooks/Button/getButtonFontWeight";
import getShadow from "../../hooks/Button/getButtonShadow";
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
      {...getBaseStyle({ mode })}
      {...getBackgroundColor({ mode, color })}
      {...getBorderColor({ mode, color })}
      {...getDisplay({ mode, block })}
      {...getFontColor({ mode, color })}
      {...getFontWeight({ mode })}
      {...getShadow({ mode })}
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
