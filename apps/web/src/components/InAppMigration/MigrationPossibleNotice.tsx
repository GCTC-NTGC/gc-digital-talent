import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Button, Notice, ScrollToLink } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { graphql } from "@gc-digital-talent/graphql";
import { errorMessages } from "@gc-digital-talent/i18n";

import LinkMyProfileDialog from "./LinkMyProfileDialog";
import WhatDoesThisMeanMigrationPossibleDialog from "./WhatDoesThisMeanMigrationPossibleDialog";
import type { MigrationNoticeProps } from "./migrationNoticeProps";

const MigrateMyAccount_Mutation = graphql(/* GraphQL */ `
  mutation MigrateMyAccount {
    migrateMyAccount
  }
`);

const MigrationPossibleNotice = ({
  scrollToIdOnIgnore,
  onDismiss,
}: MigrationNoticeProps) => {
  const intl = useIntl();
  const [, executeMigrateMyAccount] = useMutation(MigrateMyAccount_Mutation);

  const handleLinkProfile = async () => {
    const result = await executeMigrateMyAccount({});
    if (result.error || !result.data?.migrateMyAccount) {
      toast.error(intl.formatMessage(errorMessages.error));
    }
    // todo: reboot
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
              id: "A+6X3l",
              description: "Button to dismiss the message",
            })}
          </ScrollToLink>
        ) : null}
        {typeof onDismiss === "function" ? (
          <Button mode="inline" color="black" onClick={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Ignore for now",
              id: "A+6X3l",
              description: "Button to dismiss the message",
            })}
          </Button>
        ) : null}
      </Notice.Actions>
    </Notice.Root>
  );
};

export default MigrationPossibleNotice;
