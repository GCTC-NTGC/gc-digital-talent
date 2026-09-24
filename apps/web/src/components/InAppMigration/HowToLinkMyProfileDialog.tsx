import { useIntl } from "react-intl";
import { useState } from "react";

import { Button, Dialog, Link } from "@gc-digital-talent/ui";
import { getRuntimeVariable } from "@gc-digital-talent/env";

const HowToLinkMyProfileDialog = () => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);
  const manageAccountUri =
    getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI") ?? "#";

  return (
    <Dialog.Root open={open} onOpenChange={(value) => setOpen(value)}>
      <Dialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage({
            defaultMessage: "How to link my profile",
            id: "IMq+s+",
            description:
              "Button to open the dialog explaining how to link a previous profile",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "How to link my profile",
            id: "EL6z1P",
            description: "Heading for the how to link my profile dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col gap-3">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Visit CanadaLogin and make sure your email address and phone number match the contact information in your existing GC Digital Talent profile.",
                id: "asfcyQ",
                description:
                  "Paragraph instructing the user to update their contact information on CanadaLogin",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "After updating your information in CanadaLogin, sign out of GC Digital Talent and sign back in. If you continue to receive this message, no matching profile could be found.",
                id: "72hduv",
                description:
                  "Paragraph instructing the user to sign out and back in after updating their CanadaLogin information",
              })}
            </p>
            <p className="text-gray-600 dark:text-gray-200">
              {intl.formatMessage({
                defaultMessage:
                  "Please note that we will do our best to match your account, but if we can't find a profile with matching information, we won't be able to link your account due to our privacy protection policies.",
                id: "5Tf7Ev",
                description:
                  "Note that a profile cannot be linked if no matching information is found",
              })}
            </p>
          </div>
          <Dialog.Footer>
            <Link
              href={manageAccountUri}
              mode="solid"
              color="primary"
              external
              newTab
            >
              {intl.formatMessage({
                defaultMessage: "Update information on CanadaLogin",
                id: "+SXebP",
                description:
                  "Link to update contact information on the CanadaLogin website",
              })}
            </Link>
            <Dialog.Close>
              <Button type="button" mode="inline" color="primary">
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  id: "S91lA/",
                  description:
                    "Button to close the how to link my profile dialog",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default HowToLinkMyProfileDialog;
