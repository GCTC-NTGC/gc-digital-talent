import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Dialog, Button, IconButton } from "@gc-digital-talent/ui";
import { MultiSelectField, Select } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import {
  Role,
  Team,
  User,
  useUpdateUserAsAdminMutation,
} from "~/api/generated";
import { getFullNameLabel } from "~/utils/nameUtils";

import { TeamMemberFormValues } from "./types";
import { getTeamBasedRoleOptions } from "./utils";

interface AddTeamMemberDialogProps {
  team: Team;
  availableUsers: Array<User>;
  availableRoles: Array<Role>;
}

const AddTeamMemberDialog = ({
  team,
  availableRoles,
  availableUsers,
}: // onSave,
AddTeamMemberDialogProps) => {
  const intl = useIntl();
  const [, executeMutation] = useUpdateUserAsAdminMutation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const methods = useForm<TeamMemberFormValues>({
    defaultValues: {
      user: "",
      team: team.id,
      roles: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: TeamMemberFormValues) => {
    await executeMutation({
      id: formValues.user,
      user: {
        roles: {
          attach: {
            roles: formValues.roles,
            team: formValues.team,
          },
        },
      },
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Member added successfully",
              id: "AKQeBC",
              description:
                "Alert displayed to user when a team member's roles have been updated",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Member role update failed",
            id: "Ly2bBb",
            description:
              "Alert displayed to user when an error occurs while editing a team member's roles",
          }),
        );
      });
  };

  const roleOptions = getTeamBasedRoleOptions(availableRoles, intl);

  const label = intl.formatMessage({
    defaultMessage: "Add new member",
    id: "+e2nr6",
    description: "Label for the add member to team form",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton color="primary" mode="outline" icon={PlusIcon}>
          {label}
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-secondary">{label}</Dialog.Header>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Search for a new member from the list of approved managers.",
            id: "Mz61q/",
            description:
              "Help text for user field on the add member to team form",
          })}
        </p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Select
              id="user"
              name="user"
              disabled
              label={intl.formatMessage({
                defaultMessage: "Manager name",
                id: "1BEtoY",
                description:
                  "Label for the user select field on team membership form",
              })}
              options={availableUsers.filter(notEmpty).map((u) => ({
                value: u.id,
                label: getFullNameLabel(u.firstName, u.lastName, intl),
              }))}
            />
            {/** Note: Only one option since we are adding to this team's users */}
            <input type="hidden" name="team" value={team.id} />
            <Select
              id="teamDisplay"
              name="teamDisplay"
              disabled
              label={intl.formatMessage({
                defaultMessage: "Team",
                id: "0AaeXe",
                description:
                  "Label for the team select field on team membership form",
              })}
              options={[
                {
                  value: team.id,
                  label: getLocalizedName(team.displayName, intl),
                },
              ]}
            />
            <MultiSelectField
              id="roles"
              name="roles"
              label={intl.formatMessage({
                defaultMessage: "Membership roles",
                id: "cOJVBW",
                description:
                  "Label for the input to add roles to a user's team membership",
              })}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              placeholder={intl.formatMessage({
                defaultMessage: "Select roles...",
                id: "eW7I5E",
                description: "Placeholder text for role selection input",
              })}
              options={roleOptions}
            />
            <Dialog.Footer>
              <Dialog.Close>
                <Button mode="outline" color="secondary">
                  {intl.formatMessage({
                    defaultMessage: "Cancel and go back",
                    id: "tiF/jI",
                    description: "Close dialog button",
                  })}
                </Button>
              </Dialog.Close>
              <Button
                mode="solid"
                color="secondary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? intl.formatMessage(commonMessages.saving)
                  : label}
              </Button>
            </Dialog.Footer>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddTeamMemberDialog;
