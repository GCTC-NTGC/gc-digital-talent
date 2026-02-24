import { useIntl } from "react-intl";
import ArrowDownTrayIcon from "@heroicons/react/16/solid/ArrowDownTrayIcon";

import { DropdownMenu } from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";
import useUserDownloads from "~/hooks/useUserDownloads";
import useApplicationDownloads from "~/hooks/useApplicationDownloads";

const ApplicationDownloadButton_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationDownloadButton on PoolCandidate {
    id
    user {
      id
    }
  }
`);

interface DownloadButtonProps {
  query: FragmentType<typeof ApplicationDownloadButton_Fragment>;
}

const DownloadButton = ({ query }: DownloadButtonProps) => {
  const intl = useIntl();
  const application = getFragment(ApplicationDownloadButton_Fragment, query);
  const profileDoc = useUserDownloads();
  const applicationDoc = useApplicationDownloads();

  const handleProfileDocDownload = (anonymous: boolean) => {
    profileDoc.downloadDoc({
      id: application.user.id,
      anonymous,
    });
  };

  const handleApplicationDocDownload = () => {
    applicationDoc.downloadDoc({ id: application.id });
  };

  const isDownloading =
    profileDoc.downloadingDoc || applicationDoc.downloadingDoc;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        disabled={isDownloading}
        btnProps={{
          disabled: isDownloading,
          mode: "inline",
          color: "black",
          className: "text-left [&>span]:gap-x-0.5",
          icon: isDownloading ? SpinnerIcon : ArrowDownTrayIcon,
        }}
      >
        <span className="sr-only">
          {intl.formatMessage(commonMessages.download)}
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Popup
        positionerProps={{ align: "start", collisionPadding: 2 }}
      >
        <DropdownMenu.Item
          disabled={isDownloading}
          onClick={handleApplicationDocDownload}
        >
          {intl.formatMessage({
            defaultMessage: "Download application",
            id: "7lY2Qe",
            description: "Button label for downloading a user application",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={isDownloading}
          onClick={() => handleProfileDocDownload(false)}
        >
          {intl.formatMessage({
            defaultMessage: "Download full profile",
            id: "pKOeNt",
            description: "Button label for downloading a full user profile",
          })}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={isDownloading}
          onClick={() => handleProfileDocDownload(true)}
        >
          {intl.formatMessage({
            defaultMessage: "Download profile without contact information",
            id: "VR79Ue",
            description:
              "Button label for downloading an anonymous user profile.",
          })}
        </DropdownMenu.Item>
      </DropdownMenu.Popup>
    </DropdownMenu.Root>
  );
};

export default DownloadButton;
