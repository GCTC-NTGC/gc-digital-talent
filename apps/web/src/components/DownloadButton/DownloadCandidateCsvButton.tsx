import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useIntl } from "react-intl";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadCandidateCsvButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClick: (withROD?: boolean) => void;
  onClickDownloadUsers: () => void;
}

const DownloadCandidateCsvButton = ({
  inTable,
  isDownloading,
  onClick,
  onClickDownloadUsers,
  disabled,
}: DownloadCandidateCsvButtonProps) => {
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
        <DropdownMenu.Item disabled={disabled} onSelect={() => onClick(false)}>
          {intl.formatMessage({
            defaultMessage: "Download CSV without assessments",
            id: "2cZySB",
            description:
              "Button label for download candidate csv without ROD data.",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled={disabled} onSelect={() => onClick(true)}>
          {intl.formatMessage({
            defaultMessage: "Download CSV with assessments",
            id: "C1jirU",
            description:
              "Button label for download candidate csv with ROD data.",
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

export default DownloadCandidateCsvButton;
