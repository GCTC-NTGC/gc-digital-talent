import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useIntl } from "react-intl";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadAllCandidateTableCsvButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClickDownloadCandidates: () => void;
  onClickDownloadUsers: () => void;
}

const DownloadAllCandidateTableCsvButton = ({
  inTable,
  isDownloading,
  onClickDownloadCandidates,
  onClickDownloadUsers,
  disabled,
}: DownloadAllCandidateTableCsvButtonProps) => {
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
            defaultMessage: "Download CSV",
            id: "mxOuYK",
            description:
              "Text label for button to download a csv file of items in a table.",
          })}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        <DropdownMenu.Item
          disabled={disabled}
          onSelect={() => onClickDownloadCandidates()}
        >
          {intl.formatMessage({
            defaultMessage: "Download candidates CSV",
            id: "EadMpr",
            description: "Button label to download selected candidates CSV",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={disabled}
          onSelect={() => onClickDownloadUsers()}
        >
          {intl.formatMessage({
            defaultMessage: "Download users CSV",
            id: "Vyao8B",
            description:
              "Button label to download users associated with selected candidates as CSV",
          })}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadAllCandidateTableCsvButton;
