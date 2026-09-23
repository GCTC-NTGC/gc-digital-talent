import { useIntl } from "react-intl";

import { Notice, ScrollToLink } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import LinkMyProfileDialog from "./LinkMyProfileDialog";
import WhatDoesThisMeanDialog from "./WhatDoesThisMeanDialog";
import { GETTING_STARTED_FORM_ID } from "../GettingStartedPage/GettingStartedForm";

const MigrationPossibleNotice = () => {
  const intl = useIntl();

  const handleLinkProfile = () => {
    toast.error("Function not implemented.");
  };

  return (
    <Notice.Root mode="card" small>
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
        <WhatDoesThisMeanDialog onLinkProfile={handleLinkProfile} />
        <ScrollToLink to={GETTING_STARTED_FORM_ID} mode="inline" color="black">
          {intl.formatMessage({
            defaultMessage: "Ignore for now",
            id: "7Ra4fE",
            description: "Button to dismiss the account migration notice",
          })}
        </ScrollToLink>
      </Notice.Actions>
    </Notice.Root>
  );
};

export default MigrationPossibleNotice;
