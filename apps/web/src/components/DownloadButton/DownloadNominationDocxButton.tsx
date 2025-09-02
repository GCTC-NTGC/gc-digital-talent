import ArrowDownTrayIcon from "@heroicons/react/20/solid/ArrowDownTrayIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useIntl } from "react-intl";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Maybe, Scalars } from "@gc-digital-talent/graphql";

import useNominationDownloads from "~/hooks/useNominationDownloads";
import useUserDownloads from "~/hooks/useUserDownloads";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";

interface DownloadNominationDocxButtonProps {
  id: Scalars["UUID"]["output"];
  userId?: Scalars["UUID"]["output"];
  consentToShareProfile?: Maybe<boolean>;
}

const DownloadNominationDocxButton = ({
  id,
  userId,
  consentToShareProfile,
}: DownloadNominationDocxButtonProps) => {
  const intl = useIntl();
  const nominationDoc = useNominationDownloads();
  const profileDoc = useUserDownloads();

  const handleNominationDocDownload = () => {
    nominationDoc.downloadDoc({
      id,
    });
  };

  const handleProfileDocDownload = (anonymous: boolean) => {
    profileDoc.downloadDoc({
      id: userId ?? "",
      anonymous,
    });
  };

  const isDownloading =
    nominationDoc.downloadingDoc || profileDoc.downloadingDoc;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          disabled={isDownloading}
          mode="inline"
          color="black"
          className="text-left"
          utilityIcon={ChevronDownIcon}
          icon={isDownloading ? SpinnerIcon : ArrowDownTrayIcon}
        >
          <span className="sr-only">
            {intl.formatMessage(commonMessages.download)}
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        <DropdownMenu.Item
          disabled={isDownloading}
          onSelect={handleNominationDocDownload}
        >
          {intl.formatMessage({
            defaultMessage: "Download nomination",
            id: "xlx+3E",
            description:
              "Button label for downloading an individual talent nomination",
          })}
        </DropdownMenu.Item>
        {consentToShareProfile && (
          <DropdownMenu.Item
            disabled={isDownloading}
            onSelect={() => handleProfileDocDownload(false)}
          >
            {intl.formatMessage({
              defaultMessage: "Download profile",
              id: "lVOZ5k",
              description: "Button label for downloading user profiles",
            })}
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadNominationDocxButton;
