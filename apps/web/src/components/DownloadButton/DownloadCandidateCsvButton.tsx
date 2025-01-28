import { useIntl } from "react-intl";

import DownloadCsvButton from "./DownloadCsvButton";
import { CsvType } from "../PoolCandidatesTable/types";

interface DownloadCandidateCsvButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClick: (
    option: { label: string; value: CsvType },
    withROD?: boolean,
  ) => void;
}

const DownloadCandidateCsvButton = ({
  inTable,
  isDownloading,
  onClick,
  disabled,
}: DownloadCandidateCsvButtonProps) => {
  const intl = useIntl();
  const options = [
    {
      label: "Download CSV of profiles",
      value: CsvType.ProfileCsv,
    },
    {
      label: "Download CSV of applications",
      value: CsvType.ApplicationCsv,
    },
  ];
  return (
    <DownloadCsvButton
      inTable={inTable}
      isDownloading={isDownloading}
      onClick={onClick}
      disabled={disabled}
      buttonText={intl.formatMessage({
        defaultMessage: "Download CSV",
        id: "gJjIzg",
        description: "Download button",
      })}
      options={options}
      description="Download CSV"
    />
  );
};

export default DownloadCandidateCsvButton;
