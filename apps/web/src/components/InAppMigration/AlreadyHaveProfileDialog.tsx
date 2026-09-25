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
                  id: "oDKiEi",
                  description: "Paragraph explaining the move to CanadaLogin",
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-100">
                {intl.formatMessage({
                  defaultMessage:
                    "Please note that we will do our best to match your account, but if we can't find a profile with matching information, we won't be able to link your account due to our privacy protection policies.",
                  id: "5Tf7Ev",
                  description:
                    "Note that a profile cannot be linked if no matching information is found",
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
                  id: "A+6X3l",
                  description: "Button to dismiss the message",
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
