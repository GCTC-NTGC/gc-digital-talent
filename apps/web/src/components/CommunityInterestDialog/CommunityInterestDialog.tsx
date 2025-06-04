import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import CommunityInterest, {
  CommunityInterestOptions_Fragment,
} from "../CommunityInterest/CommunityInterest";

export const CommunityInterestDialog_Fragment = graphql(/* GraphQL */ `
  fragment CommunityInterestDialog on CommunityInterest {
    id
    community {
      name {
        localized
      }
    }
    ...CommunityInterest
  }
`);

interface CommunityInterestDialogProps {
  communityInterestQuery: FragmentType<typeof CommunityInterestDialog_Fragment>;
  communityInterestOptionsQuery: FragmentType<
    typeof CommunityInterestOptions_Fragment
  >;
  trigger?: ReactNode;
  defaultOpen?: boolean;
}

const CommunityInterestDialog = ({
  communityInterestQuery,
  communityInterestOptionsQuery,
  trigger,
  defaultOpen = false,
}: CommunityInterestDialogProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);
  const communityInterest = getFragment(
    CommunityInterestDialog_Fragment,
    communityInterestQuery,
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const title = communityInterest.community?.name?.localized ?? notAvailable;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger || <Button>{title}</Button>}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage: "View and edit your settings for this community.",
            id: "PRRKAq",
            description: "Subtitle for dialog viewing a community interest",
          })}
        >
          {title}
        </Dialog.Header>
        <Dialog.Body>
          <CommunityInterest
            communityInterestQuery={communityInterest}
            communityInterestOptionsQuery={communityInterestOptionsQuery}
          />
          <Dialog.Footer>
            <Link
              mode="solid"
              color="primary"
              href={paths.communityInterest(communityInterest.id)}
            >
              {intl.formatMessage({
                defaultMessage: "Edit this community",
                id: "zpr5ny",
                description: "Link text for edit interest in a community",
              })}
            </Link>
            <Dialog.Close>
              <Button mode="inline" color="warning">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CommunityInterestDialog;
