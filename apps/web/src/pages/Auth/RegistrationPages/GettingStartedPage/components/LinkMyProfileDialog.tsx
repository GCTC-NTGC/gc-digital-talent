import { useIntl } from "react-intl";
import { useState } from "react";

import { Button, Dialog, Heading } from "@gc-digital-talent/ui";

interface LinkMyProfileDialogProps {
  onLinkProfile: () => void;
}

const LinkMyProfileDialog = ({ onLinkProfile }: LinkMyProfileDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog.Root open={open} onOpenChange={(value) => setOpen(value)}>
      <Dialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage({
            defaultMessage: "Link my profile",
            id: "v7rPLM",
            description:
              "Button to link a previous profile to the new sign in method",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Link my profile",
            id: "rIT3LB",
            description: "Heading for the link my profile dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col gap-3">
            <Heading level="h3" size="h6" className="mt-0">
              {intl.formatMessage({
                defaultMessage: "You will be automatically signed out",
                id: "YLhr0P",
                description:
                  "Heading warning the user they will be signed out after linking their profile",
              })}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You're about to link your CanadaLogin with your existing GC Digital Talent profile. Doing so will delete this profile and replace it with your existing information. Once connected, you'll be signed out and can sign back in using your CanadaLogin. You will then see your existing profile information, including your applications and career experiences.",
                id: "H+mm8d",
                description:
                  "Paragraph explaining what happens when a user links their profile",
              })}
            </p>
          </div>
          <Dialog.Footer>
            <Button type="button" color="primary" onClick={onLinkProfile}>
              {intl.formatMessage({
                defaultMessage: "Link my profile",
                id: "2MKRxi",
                description:
                  "Button to confirm linking a previous profile to the new sign in method",
              })}
            </Button>
            <Dialog.Close>
              <Button type="button" mode="inline" color="primary">
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  id: "1vAQix",
                  description: "Button to cancel linking a previous profile",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LinkMyProfileDialog;
