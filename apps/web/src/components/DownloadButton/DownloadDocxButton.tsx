import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useIntl } from "react-intl";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadDocxButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClick: (anonymous: boolean) => void;
}

const DownloadDocxButton = ({
  inTable,
  isDownloading,
  onClick,
  disabled,
}: DownloadDocxButtonProps) => {
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
            defaultMessage: "Download profile",
            id: "ekazTc",
            description: "Button text to download pool candidate profiles",
          })}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        <DropdownMenu.Item disabled={disabled} onSelect={() => onClick(false)}>
          {intl.formatMessage({
            defaultMessage: "Download with all information",
            id: "i0N7DM",
            description: "Button label for download user profile.",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled={disabled} onSelect={() => onClick(true)}>
          {intl.formatMessage({
            defaultMessage: "Download without contact information",
            id: "hRtj0w",
            description: "Button label for download user anonymous profile.",
          })}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadDocxButton;
