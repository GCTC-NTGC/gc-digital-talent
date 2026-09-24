import { useIntl } from "react-intl";

import { Button, Notice, ScrollToLink } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import LinkMyProfileDialog from "./LinkMyProfileDialog";
import WhatDoesThisMeanMigrationPossibleDialog from "./WhatDoesThisMeanMigrationPossibleDialog";
import type { MigrationNoticeProps } from "./migrationNoticeProps";

const MigrationPossibleNotice = ({
  scrollToIdOnIgnore,
  onDismiss,
}: MigrationNoticeProps) => {
  const intl = useIntl();

  const handleLinkProfile = () => {
    toast.error("Function not implemented.");
  };

  return (
    <Notice.Root
      mode="card"
      small
      onDismiss={typeof onDismiss === "function" ? onDismiss : undefined}
    >
      <Notice.Title defaultIcon>
        {intl.formatMessage({
          defaultMessage:
            "It looks like you previously created an account with us",
          id: "J39ef2",
          description:
            "Title for the notice that an account migration is possible",
        })}
      </Notice.Title>
      <Notice.Content>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Would you like your profile to be linked to your new sign in method?",
            id: "IbmGG2",
            description:
              "Body of the notice that an account migration is possible",
          })}
        </p>
      </Notice.Content>
      <Notice.Actions>
        <LinkMyProfileDialog onLinkProfile={handleLinkProfile} />
        <WhatDoesThisMeanMigrationPossibleDialog
          onLinkProfile={handleLinkProfile}
        />
        {typeof scrollToIdOnIgnore === "string" ? (
          <ScrollToLink to={scrollToIdOnIgnore} mode="inline" color="black">
            {intl.formatMessage({
              defaultMessage: "Ignore for now",
              id: "7Ra4fE",
              description: "Button to dismiss the account migration notice",
            })}
          </ScrollToLink>
        ) : null}
        {typeof onDismiss === "function" ? (
          <Button mode="inline" color="black" onClick={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Ignore for now",
              id: "7Ra4fE",
              description: "Button to dismiss the account migration notice",
            })}
          </Button>
        ) : null}
      </Notice.Actions>
    </Notice.Root>
  );
};

export default MigrationPossibleNotice;
