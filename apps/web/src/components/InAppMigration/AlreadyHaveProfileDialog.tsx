import { useIntl } from "react-intl";

import { Button, Dialog, Heading, Link } from "@gc-digital-talent/ui";
import { getRuntimeVariable } from "@gc-digital-talent/env";

const AlreadyHaveProfileDialog = () => {
  const intl = useIntl();
  const manageAccountUri =
    getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI") ?? "#";

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button mode="inline">
          {intl.formatMessage({
            defaultMessage: "I already have a profile",
            id: "ej4pJP",
            description: "trigger for the already have a profile dialog",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "I already have a profile",
            id: "uEhbRu",
            description: "Heading for the already have a profile dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Heading level="h3" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "What's happening",
                  id: "I2Rrlc",
                  description:
                    "Heading for the explanation section of the already have a profile dialog",
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
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Existing GC Digital Talent users can learn more about how to link their profiles below.",
                  id: "VrTM9R",
                  description:
                    "Paragraph pointing existing users to the linking instructions",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "If this is your first time visiting, no action is required.",
                  id: "2Cem3h",
                  description:
                    "Paragraph reassuring first time visitors that no action is required",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Heading level="h3" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "What linking your profile means",
                  id: "o9iWX4",
                  description:
                    "Heading for the linking explanation section of the already have a profile dialog",
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
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Any information currently in your new profile will be replaced with the data from your existing GC Digital Talent profile. Once your profile is linked, please check that your information is up to date.",
                  id: "zAPa6H",
                  description:
                    "Paragraph explaining that linking a profile replaces the information in the new profile",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Heading level="h3" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage:
                    "How to link your previous profile to your new sign in method",
                  id: "Gz6GUr",
                  description:
                    "Heading for the instructions section of the already have a profile dialog",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Visit CanadaLogin and make sure your email address and phone number match the contact information in your existing GC Digital Talent profile.",
                  id: "YQ3j5R",
                  description:
                    "Instruction to update contact information on CanadaLogin",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "After updating your information in CanadaLogin, sign out of GC Digital Talent and sign back in. If you continue to receive this message, no matching profile could be found.",
                  id: "pRgDng",
                  description:
                    "Instruction to log out and back in after updating contact information",
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-100">
                {intl.formatMessage({
                  defaultMessage:
                    "Please note that we will do our best to match your account, but if we can't find a profile with matching information, we won't be able to link your account due to our privacy protection policies.",
                  id: "jGQ2lZ",
                  description:
                    "Disclaimer about account matching and privacy protection",
                })}
              </p>
            </div>
          </div>
          <Dialog.Footer>
            <Link
              href={manageAccountUri}
              external
              newTab
              mode="solid"
              color="primary"
            >
              {intl.formatMessage({
                defaultMessage: "Update information on CanadaLogin",
                id: "48XoeT",
                description:
                  "Link to update contact information on CanadaLogin",
              })}
            </Link>
            <Dialog.Close>
              <Button type="button" mode="inline" color="primary">
                {intl.formatMessage({
                  defaultMessage: "Ignore for now",
                  id: "va53vo",
                  description:
                    "Button text to dismiss the already have a profile dialog",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AlreadyHaveProfileDialog;
