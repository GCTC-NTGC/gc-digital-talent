import { useIntl } from "react-intl";
import ArrowDownTrayIcon from "@heroicons/react/20/solid/ArrowDownTrayIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";
import { Scalars } from "@gc-digital-talent/graphql";

import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";
import useUserDownloads from "~/hooks/useUserDownloads";
import useApplicationDownloads from "~/hooks/useApplicationDownloads";

interface DownloadButtonProps {
  id: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
}

const DownloadButton = ({ id, userId }: DownloadButtonProps) => {
  const intl = useIntl();
  const profileDoc = useUserDownloads();
  const applicationDoc = useApplicationDownloads();

  const handleProfileDocDownload = (anonymous: boolean) => {
    profileDoc.downloadDoc({
      id: userId,
      anonymous,
    });
  };

  const handleApplicationDocDownload = () => {
    applicationDoc.downloadDoc({ id });
  };

  const isDownloading =
    profileDoc.downloadingDoc || applicationDoc.downloadingDoc;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          disabled={isDownloading}
          mode="inline"
          color="primary"
          utilityIcon={ChevronDownIcon}
          icon={isDownloading ? SpinnerIcon : ArrowDownTrayIcon}
        >
          {intl.formatMessage({
            defaultMessage: "Download",
            id: "9XgUGm",
            description:
              "Button text to download an applicants application or profile",
          })}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        <DropdownMenu.Item
          disabled={isDownloading}
          onSelect={handleApplicationDocDownload}
        >
          {intl.formatMessage({
            defaultMessage: "Download application",
            id: "7lY2Qe",
            description: "Button label for downloading a user application",
          })}
        </DropdownMenu.Item>
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
