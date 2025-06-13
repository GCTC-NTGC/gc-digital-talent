import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useIntl } from "react-intl";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadDocxButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClickApplication: () => void;
  onClickProfile: () => void;
  onClickAnonymousProfile: () => void;
}

const DownloadDocxButton = ({
  inTable,
  isDownloading,
  onClickApplication,
  onClickProfile,
  onClickAnonymousProfile,
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
            defaultMessage: "Download DOCX",
            id: "j357Vx",
            description: "Button text to download DOCX files",
          })}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        <DropdownMenu.Item disabled={disabled} onSelect={onClickApplication}>
          {intl.formatMessage({
            defaultMessage: "Download application",
            id: "3uD9Sb",
            description:
              "Button label for downloading an application snapshots",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled={disabled} onSelect={onClickProfile}>
          {intl.formatMessage({
            defaultMessage: "Download profile",
            id: "lVOZ5k",
            description: "Button label for downloading user profiles",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={disabled}
          onSelect={onClickAnonymousProfile}
        >
          {intl.formatMessage({
            defaultMessage: "Download profile without contact information",
            id: "wZP4RN",
            description:
              "Button label for downloading anonymized user profiles",
          })}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadDocxButton;
