import { useIntl } from "react-intl";
import ArrowDownTrayIcon from "@heroicons/react/20/solid/ArrowDownTrayIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";
import { Scalars } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";
import useUserDownloads from "~/hooks/useUserDownloads";

interface DownloadButtonProps {
  id: Scalars["UUID"]["output"];
}

const DownloadButton = ({ id }: DownloadButtonProps) => {
  const intl = useIntl();
  const profileDoc = useUserDownloads();

  const handleProfileDocDownload = (anonymous: boolean) => {
    profileDoc.downloadDoc({
      id,
      anonymous,
    });
  };

  const isDownloading = profileDoc.downloadingDoc;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          disabled={isDownloading}
          mode="inline"
          block
          utilityIcon={ChevronDownIcon}
          icon={isDownloading ? SpinnerIcon : ArrowDownTrayIcon}
        >
          {intl.formatMessage({
            defaultMessage: "Download profile",
            id: "WimaP7",
            description: "Button text to download a users profile",
          })}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" collisionPadding={2}>
        <DropdownMenu.Item
          disabled={isDownloading}
          onSelect={() => handleProfileDocDownload(false)}
        >
          {intl.formatMessage({
            defaultMessage: "Download full profile",
            id: "pKOeNt",
            description: "Button label for downloading a full user profile",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={isDownloading}
          onSelect={() => handleProfileDocDownload(true)}
        >
          {intl.formatMessage({
            defaultMessage: "Download profile without contact information",
            id: "VR79Ue",
            description:
              "Button label for downloading an anonymous user profile.",
          })}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadButton;
