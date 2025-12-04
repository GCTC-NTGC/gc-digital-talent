import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import PuzzlePieceIcon from "@heroicons/react/16/solid/PuzzlePieceIcon";
import { defineMessage, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  Heading,
  TableOfContents,
  Notice,
} from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import DeleteUserDialog from "./DeleteUserDialog";
import RestoreUserDialog from "./RestoreUserDialog";

interface FormValues {
  sub: string;
}

export const SUPPORT_TOOLS_ID = "support-tools";

export const supportToolsTitle = defineMessage({
  defaultMessage: "Support tools",
  id: "9xH8D8",
  description: "Title of admin user support tools section",
});

export const UpdateSub_Mutation = graphql(/* GraphQL */ `
  mutation UpdateSub($input: UpdateUserSubInput!) {
    updateUserSub(updateUserSubInput: $input) {
      id
    }
  }
`);

const SupportTools_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserSupportTools on User {
    id
    deletedDate
    authInfo {
      sub
    }
    ...DeleteUserDialog
    ...RestoreUserDialog
  }
`);

interface SupportToolsProps {
  query: FragmentType<typeof SupportTools_Fragment>;
}

const SupportTools = ({ query }: SupportToolsProps) => {
  const intl = useIntl();
  const user = getFragment(SupportTools_Fragment, query);
  const [{ fetching }, executeMutation] = useMutation(UpdateSub_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: { sub: user?.authInfo?.sub ?? "" },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update subject.",
        id: "iFyi4k",
        description: "Error message when updating subject failed",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (fetching) return;

    await executeMutation({
      input: {
        userId: user.id,
        sub: values.sub,
      },
    })
      .then((res) => {
        if (res.error || !res.data?.updateUserSub) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Updated subject successfully!",
            id: "HeRHvS",
            description: "Success message when updating a users subject",
          }),
        );
      })
      .catch(handleError);
  };

  return (
    <TableOfContents.Section id={SUPPORT_TOOLS_ID}>
      <TableOfContents.Heading
        icon={WrenchScrewdriverIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(supportToolsTitle)}
      </TableOfContents.Heading>
      <Notice.Root color="warning">
        <Notice.Content>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Warning! These are sensitive actions that will affect the entire platform, please use extreme caution when changing these settings.",
              id: "GkX/KN",
              description:
                "Warning that you are making changes of possibly very high impact",
            })}
          </p>
        </Notice.Content>
      </Notice.Root>
      <Heading level="h3" size="h6">
        {intl.formatMessage({
          defaultMessage: "Update subject",
          id: "ugdr1V",
          description: "Heading for form to update a users subject",
        })}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Change this user’s subject information. The 'subject' is a string that uniquely identifies a user's sign in identity.",
          id: "N7nVPk",
          description: "Description of the form to update a users subject",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div className="mb-6">
            <Input
              id="sub"
              name="sub"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Subject",
                id: "m4rXNt",
                description: "Label displayed on the user form subject field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
          <Button type="submit" color="error" icon={PuzzlePieceIcon}>
            {intl.formatMessage({
              defaultMessage: "Submit subject change",
              id: "Wzet+6",
              description: "Button text to update a users subject",
            })}
          </Button>
        </form>
      </FormProvider>
      {user.deletedDate ? (
        <>
          <Heading level="h3" size="h6">
            {intl.formatMessage({
              defaultMessage: "Restore user",
              id: "CzZm8F",
              description: "Label for restoring a user",
            })}
          </Heading>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "This will remove the user from the archive and restore their profile on the platform. All of their previous information will be available again.",
              id: "kTg84C",
              description:
                "Description of the form to restore a soft-deleted user",
            })}
          </p>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "This user was archived on",
              id: "j5IepM",
              description:
                "Description of the form to restore a soft-deleted user",
            }) +
              intl.formatMessage(commonMessages.dividingColon) +
              formatDate({
                date: parseDateTimeUtc(user.deletedDate),
                formatString: "yyyy-MM-dd",
                intl,
              })}
          </p>
          <RestoreUserDialog query={user} />
        </>
      ) : (
        <>
          <Heading level="h3" size="h6">
            {intl.formatMessage({
              defaultMessage: "Archive user",
              id: "Tdmlnn",
              description: "Label for soft-deleting a user",
            })}
          </Heading>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                'This will change the status of a user to "Archived". This will prevent the user from appearing anywhere on the platform.',
              id: "I/3WDu",
              description: "Description of the form to soft-delete a user",
            })}
          </p>
          <DeleteUserDialog query={user} />
        </>
      )}
    </TableOfContents.Section>
  );
};

export default SupportTools;
