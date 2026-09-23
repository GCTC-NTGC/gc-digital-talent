import { useIntl } from "react-intl";
import { useState } from "react";

import { Button, Dialog, Heading } from "@gc-digital-talent/ui";

interface WhatDoesThisMeanDialogProps {
  onLinkProfile: () => void;
}

const WhatDoesThisMeanDialog = ({
  onLinkProfile,
}: WhatDoesThisMeanDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog.Root open={open} onOpenChange={(value) => setOpen(value)}>
      <Dialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage({
            defaultMessage: "What does this mean",
            id: "KmnIsh",
            description:
              "Button to learn more about linking a previous profile",
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
                  id: "U5CZbt",
                  description:
                    "Paragraph explaining the move from GCKey to CanadaLogin",
                })}
              </p>
            </div>
            <div>
              <Heading level="h3" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "What linking your profile means",
                  id: "+1yIis",
                  description:
                    "Heading for the section explaining what linking a profile means",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "If your email and phone number on CanadaLogin match those on your existing GC Digital Talent profile, linking your profile will connect your previous data to your new sign in method.",
                  id: "20+bZk",
                  description:
                    "Paragraph explaining what happens when a user links their profile",
                })}
              </p>
            </div>
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
                id: "Hy2Utd",
                description:
                  "Button to link a previous profile from the what does this mean dialog",
              })}
            </Button>
            <Dialog.Close>
              <Button type="button" mode="inline" color="primary">
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  id: "KmThxq",
                  description: "Button to close the what does this mean dialog",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WhatDoesThisMeanDialog;
