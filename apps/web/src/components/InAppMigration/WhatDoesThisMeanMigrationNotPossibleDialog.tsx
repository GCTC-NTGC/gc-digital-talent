import { useIntl } from "react-intl";
import { useState } from "react";

import { Button, Dialog, Heading, Link } from "@gc-digital-talent/ui";
import { getRuntimeVariable } from "@gc-digital-talent/env";

const WhatDoesThisMeanMigrationNotPossibleDialog = () => {
  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);
  const manageAccountUri =
    getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI") ?? "#";

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
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
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
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Existing GC Digital Talent users can learn more about what linking your profile means below.",
                  id: "gQYUdo",
                  description:
                    "Paragraph pointing existing users to the explanation of linking a profile",
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
            <div className="flex flex-col gap-3">
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
                    "If your email address and phone number in CanadaLogin match the information in your existing GC Digital Talent profile, linking your profile will connect your existing data to your new sign in method.",
                  id: "RwJJEM",
                  description:
                    "Paragraph explaining what happens when a user links their profile",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Any information currently in your new profile will be replaced with the data from your existing GC Digital Talent profile. Once your profile is linked, please check that your information is up to date.",
                  id: "wgLkIU",
                  description:
                    "Paragraph warning that new profile data will be replaced when linking a profile",
                })}
              </p>
            </div>
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

export default WhatDoesThisMeanMigrationNotPossibleDialog;
