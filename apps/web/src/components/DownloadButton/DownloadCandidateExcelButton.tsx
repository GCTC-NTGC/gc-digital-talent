import { useIntl } from "react-intl";

import { DropdownMenu } from "@gc-digital-talent/ui";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadCandidateExcelButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClick: (withROD?: boolean) => void;
  onClickDownloadUsers: () => void;
}

const DownloadCandidateExcelButton = ({
  inTable,
  isDownloading,
  onClick,
  onClickDownloadUsers,
  disabled,
}: DownloadCandidateExcelButtonProps) => {
  const intl = useIntl();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        btnProps={{
          disabled,
          icon: isDownloading ? SpinnerIcon : undefined,
          ...(inTable ? actionButtonStyles : { color: "primary" }),
        }}
      >
        {intl.formatMessage({
          defaultMessage: "Download Excel",
          id: "YO7woE",
          description:
            "Text label for button to download a excel file of items in a table.",
        })}
      </DropdownMenu.Trigger>
      <DropdownMenu.Popup
        positionerProps={{ align: "end", collisionPadding: 2 }}
      >
        <DropdownMenu.Item disabled={disabled} onClick={() => onClick(false)}>
          {intl.formatMessage({
            defaultMessage: "Download Excel without assessments",
            id: "Ji6+E5",
            description:
              "Button label for download candidate excel without ROD data.",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled={disabled} onClick={() => onClick(true)}>
          {intl.formatMessage({
            defaultMessage: "Download Excel with assessments",
            id: "pHwRH1",
            description:
              "Button label for download candidate excel with ROD data.",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={disabled}
          onClick={() => onClickDownloadUsers()}
        >
          {intl.formatMessage({
            defaultMessage: "Download profiles Excel",
            id: "1PYGkw",
            description:
              "Button label to download users associated with selected candidates as Excel",
          })}
        </DropdownMenu.Item>
      </DropdownMenu.Popup>
    </DropdownMenu.Root>
  );
};

export default DownloadCandidateExcelButton;
