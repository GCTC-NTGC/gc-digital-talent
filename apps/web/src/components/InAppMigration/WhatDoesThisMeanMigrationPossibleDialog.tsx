import { useIntl } from "react-intl";
import { useState } from "react";

import { Button, Dialog, Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

interface WhatDoesThisMeanMigrationPossibleDialogProps {
  onLinkProfile: () => void;
}

const WhatDoesThisMeanMigrationPossibleDialog = ({
  onLinkProfile,
}: WhatDoesThisMeanMigrationPossibleDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog.Root open={open} onOpenChange={(value) => setOpen(value)}>
      <Dialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage({
            defaultMessage: "What does this mean",
            id: "RYBnXq",
            description: "Button to learn more about the account migration",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "What does this mean",
            id: "vgEQS5",
            description: "Heading for the what does this mean dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col gap-3">
            <div>
              <Heading level="h3" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "What's happening",
                  id: "Qjf3b1",
                  description:
                    "Heading for the section explaining the sign in method change",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "We've moved to CanadaLogin, a central sign in method that has replaced the previously used GCKey sign in method.",
                  id: "riPKUN",
                  description: "Paragraph explaining the move to CanadaLogin",
                })}
              </p>
            </div>
            <div>
              <Heading level="h3" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "What linking your profile means",
                  id: "a+UXof",
                  description:
                    "Heading for the linking explanation section of a dialog",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "If your email address and phone number in CanadaLogin match the information in your existing GC Digital Talent profile, linking your profile will connect your existing data to your new sign in method.",
                  id: "t7Zpp9",
                  description:
                    "Paragraph explaining what linking a profile means",
                })}
              </p>
            </div>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Any information currently in your new profile will be replaced with the data from your existing GC Digital Talent profile. Once your profile is linked, please check that your information is up to date.",
                id: "wgLkIU",
                description:
                  "Paragraph warning that new profile data will be replaced when linking a profile",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "If this is your first time visiting, no action is required.",
                id: "3JjHhP",
                description:
                  "Paragraph telling new users they do not need to link a profile",
              })}
            </p>
          </div>
          <Dialog.Footer>
            <Button type="button" color="primary" onClick={onLinkProfile}>
              {intl.formatMessage({
                defaultMessage: "Link my profile",
                id: "v7rPLM",
                description:
                  "Button to link a previous profile to the new sign in method",
              })}
            </Button>
            <Dialog.Close>
              <Button type="button" mode="inline" color="primary">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WhatDoesThisMeanMigrationPossibleDialog;
