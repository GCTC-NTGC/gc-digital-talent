import { useIntl } from "react-intl";

import { DropdownMenu } from "@gc-digital-talent/ui";
import { empty } from "@gc-digital-talent/helpers";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadDocxButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClickApplication?: () => void;
  onClickProfile?: () => void;
  onClickAnonymousProfile?: () => void;
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
      <DropdownMenu.Trigger
        btnProps={{
          disabled,
          icon: isDownloading ? SpinnerIcon : undefined,
          ...(inTable ? actionButtonStyles : { color: "primary" }),
        }}
      >
        {intl.formatMessage({
          defaultMessage: "Download DOCX",
          id: "j357Vx",
          description: "Button text to download DOCX files",
        })}
      </DropdownMenu.Trigger>
      <DropdownMenu.Popup
        positionerProps={{ align: "end", collisionPadding: 2 }}
      >
        {!empty(onClickApplication) ? (
          <DropdownMenu.Item disabled={disabled} onClick={onClickApplication}>
            {intl.formatMessage({
              defaultMessage: "Download application",
              id: "3uD9Sb",
              description:
                "Button label for downloading an application snapshots",
            })}
          </DropdownMenu.Item>
        ) : null}
        {!empty(onClickProfile) ? (
          <DropdownMenu.Item disabled={disabled} onClick={onClickProfile}>
            {intl.formatMessage({
              defaultMessage: "Download profile",
              id: "lVOZ5k",
              description: "Button label for downloading user profiles",
            })}
          </DropdownMenu.Item>
        ) : null}
        {!empty(onClickAnonymousProfile) ? (
          <DropdownMenu.Item
            disabled={disabled}
            onClick={onClickAnonymousProfile}
          >
            {intl.formatMessage({
              defaultMessage: "Download profile without contact information",
              id: "wZP4RN",
              description:
                "Button label for downloading anonymized user profiles",
            })}
          </DropdownMenu.Item>
        ) : null}
      </DropdownMenu.Popup>
    </DropdownMenu.Root>
  );
};

export default DownloadDocxButton;
