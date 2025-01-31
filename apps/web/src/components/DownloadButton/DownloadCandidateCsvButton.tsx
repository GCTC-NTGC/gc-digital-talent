import { useIntl } from "react-intl";

import DownloadCsvButton from "./DownloadCsvButton";
import { CsvType } from "../PoolCandidatesTable/types";

interface DownloadCandidateCsvButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClick: (
    option: { label: string; value: CsvType },
    processNumber?: string,
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
      label: intl.formatMessage({
        defaultMessage: "Download CSV of Profiles",
        id: "N4dNc9",
        description: "Download CSV of Profiles",
      }),
      value: CsvType.ProfileCsv,
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Download CSV of Applications",
        id: "nrfOGl",
        description: "Download CSV of Applications",
      }),
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
