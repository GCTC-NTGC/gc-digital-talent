import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useIntl } from "react-intl";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";

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
      <DropdownMenu.Trigger>
        <Button
          disabled={disabled}
          utilityIcon={ChevronDownIcon}
          {...(isDownloading && {
            icon: SpinnerIcon,
          })}
          {...(inTable
            ? {
                ...actionButtonStyles,
              }
            : {
                color: "primary",
              })}
        >
          {intl.formatMessage({
            defaultMessage: "Download Excel",
            id: "YO7woE",
            description:
              "Text label for button to download a excel file of items in a table.",
          })}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        <DropdownMenu.Item
          disabled={disabled}
          onSelect={() => onClickDownloadCandidates()}
        >
          {intl.formatMessage({
            defaultMessage: "Download applications Excel",
            id: "XWyKqc",
            description: "Button label to download selected candidates Excel",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={disabled}
          onSelect={() => onClickDownloadUsers()}
        >
          {intl.formatMessage({
            defaultMessage: "Download profiles Excel",
            id: "1PYGkw",
            description:
              "Button label to download users associated with selected candidates as Excel",
          })}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadAllCandidateTableExcelButton;
