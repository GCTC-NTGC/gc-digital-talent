import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import PuzzlePieceIcon from "@heroicons/react/16/solid/PuzzlePieceIcon";
import { useState } from "react";
import { defineMessage, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion, Button, TableOfContents } from "@gc-digital-talent/ui";
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

const UpdateSub_Mutation = graphql(/* GraphQL */ `
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

  const sectionKeys = [
    "update_subject",
    user.deletedDate ? "restore_user" : "archive_user",
  ];
  const [openSections, setOpenSections] = useState<string[]>([]);
  const hasOpenSections = openSections.length > 0;
  const toggleSections = () => {
    setOpenSections(hasOpenSections ? [] : sectionKeys);
  };

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
    <TableOfContents.Section id={SUPPORT_TOOLS_ID} className="mb-18">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <TableOfContents.Heading
          icon={WrenchScrewdriverIcon}
          color="secondary"
          className="m-0"
        >
          {intl.formatMessage(supportToolsTitle)}
        </TableOfContents.Heading>
        <Button mode="inline" color="primary" onClick={toggleSections}>
          {hasOpenSections
            ? intl.formatMessage({
                defaultMessage:
                  "Collapse all<hidden> support tools</hidden> sections",
                id: "T2nOMo",
                description:
                  "Button text to close all support tools accordions",
              })
            : intl.formatMessage({
                defaultMessage:
                  "Expand all<hidden> support tools</hidden> sections",
                id: "VgKm/x",
                description: "Button text to open all support tools accordions",
              })}
        </Button>
      </div>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Warning! These are sensitive actions that will affect the entire platform, please use extreme caution when changing these settings.",
          id: "GkX/KN",
          description:
            "Warning that you are making changes of possibly very high impact",
        })}
      </p>
      <Accordion.Root
        mode="card"
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
      >
        <Accordion.Item value="update_subject">
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage: "Replace account subject",
              id: "ej6PFj",
              description: "Heading for form to update a users subject",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p className="mb-6">
              {intl.formatMessage({
                defaultMessage:
                  "Change this user’s subject information. The 'subject' is a string that uniquely identifies a user's sign in identity.",
                id: "N7nVPk",
                description:
                  "Description of the form to update a users subject",
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
                      description:
                        "Label displayed on the user form subject field.",
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
          </Accordion.Content>
        </Accordion.Item>
        {user.deletedDate ? (
          <Accordion.Item value="restore_user">
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Restore user",
                id: "CzZm8F",
                description: "Label for restoring a user",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "This will remove the user from the archive and restore their profile on the platform. All of their previous information will be available again.",
                  id: "kTg84C",
                  description:
                    "Description of the form to restore a soft-deleted user",
                })}
              </p>
              <p className="mb-6">
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
            </Accordion.Content>
          </Accordion.Item>
        ) : (
          <Accordion.Item value="archive_user">
            <Accordion.Trigger as="h3">
              {intl.formatMessage({
                defaultMessage: "Archive user",
                id: "Tdmlnn",
                description: "Label for soft-deleting a user",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    'This will change the status of a user to "Archived". This will prevent the user from appearing anywhere on the platform.',
                  id: "I/3WDu",
                  description: "Description of the form to soft-delete a user",
                })}
              </p>
              <DeleteUserDialog query={user} />
            </Accordion.Content>
          </Accordion.Item>
        )}
      </Accordion.Root>
    </TableOfContents.Section>
  );
};

export default SupportTools;
