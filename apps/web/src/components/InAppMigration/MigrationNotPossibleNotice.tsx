import { useIntl } from "react-intl";

import { Button, Notice, ScrollToLink } from "@gc-digital-talent/ui";

import HowToLinkMyProfileDialog from "./HowToLinkMyProfileDialog";
import type {
  MigrationNoticeDismissProps,
  MigrationNoticeScrollProps,
} from "./migrationNoticeProps";
import WhatDoesThisMeanLongDialog from "./WhatDoesThisMeanLongDialog";

const MigrationNotPossibleNotice = ({
  ignoreAction,
  scrollToIdOnIgnore,
  onDismiss,
}: MigrationNoticeScrollProps | MigrationNoticeDismissProps) => {
  const intl = useIntl();

  return (
    <Notice.Root mode="card" small onDismiss={onDismiss}>
      <Notice.Title defaultIcon>
        {intl.formatMessage({
          defaultMessage: "We've migrated account systems",
          id: "S1xHTg",
          description:
            "Title for the notice that account systems have been migrated",
        })}
      </Notice.Title>
      <Notice.Content>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "We've migrated to CanadaLogin, replacing GCKey as our central sign in method. Existing GC Digital Talent users can learn more about how to link their profiles below. If this is your first time visiting, no action is required.",
            id: "OyDaNz",
            description:
              "Body of the notice that account systems have been migrated",
          })}
        </p>
      </Notice.Content>
      <Notice.Actions>
        <HowToLinkMyProfileDialog />
        <WhatDoesThisMeanLongDialog />
        {ignoreAction === "scroll" ? (
          <ScrollToLink to={scrollToIdOnIgnore} mode="inline" color="black">
            {intl.formatMessage({
              defaultMessage: "Ignore for now",
              id: "7Ra4fE",
              description: "Button to dismiss the account migration notice",
            })}
          </ScrollToLink>
        ) : null}
        {ignoreAction === "dismiss" ? (
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

export default MigrationNotPossibleNotice;
