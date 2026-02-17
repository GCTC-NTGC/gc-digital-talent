import { useIntl } from "react-intl";

import { DropdownMenu } from "@gc-digital-talent/ui";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadAllCandidateTableExcelButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClickDownloadCandidates: () => void;
  onClickDownloadUsers: () => void;
}

const DownloadAllCandidateTableExcelButton = ({
  inTable,
  isDownloading,
  onClickDownloadCandidates,
  onClickDownloadUsers,
  disabled,
}: DownloadAllCandidateTableExcelButtonProps) => {
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
        <DropdownMenu.Item
          disabled={disabled}
          onClick={() => onClickDownloadCandidates()}
        >
          {intl.formatMessage({
            defaultMessage: "Download applications Excel",
            id: "XWyKqc",
            description: "Button label to download selected candidates Excel",
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

export default DownloadAllCandidateTableExcelButton;
