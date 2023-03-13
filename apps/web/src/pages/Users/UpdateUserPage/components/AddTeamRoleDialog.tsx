import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Dialog, Button, IconButton } from "@gc-digital-talent/ui";
import {
  MultiSelectField,
  SelectFieldV2 as SelectField,
} from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import {
  Role,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
  useListTeamsQuery,
} from "~/api/generated";

import { getFullNameHtml } from "~/utils/nameUtils";

type FormValues = {
  roles: Array<string>;
  team: string | null;
};

export type TeamRoleSubmitData = Partial<UpdateUserAsAdminInput>;

interface AddTeamRoleDialogProps {
  user: User;
  availableRoles: Array<Role>;
  onAddRoles: (
    submitData: UpdateUserAsAdminInput,
  ) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
}

const AddTeamRoleDialog = ({
  user,
  availableRoles,
  onAddRoles,
}: AddTeamRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const userName = getFullNameHtml(user.firstName, user.lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: [],
      team: null,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAddRoles = async (formValues: FormValues) => {
    return onAddRoles({
      roles: {
        attach: {
          roles: formValues.roles,
          team: formValues.team,
        },
      },
    }).then(() => {
      setIsOpen(false);
      toast.success(
        intl.formatMessage({
          defaultMessage: "Role(s) added successfully",
          id: "/17wgm",
          description:
            "Message displayed to user when one or more roles have been added to a user",
        }),
      );
    });
  };

  const label = intl.formatMessage({
    defaultMessage: "Add new membership",
    id: "Ibt1fL",
    description: "Label for the form to add a team membership to a user",
  });

  const roleOptions = availableRoles
    .filter((role) => role.isTeamBased)
    .map((role) => ({
      label: getLocalizedName(role.displayName, intl),
      value: role.id,
    }));

  const [{ data: teamsData, fetching: teamsFetching }] = useListTeamsQuery();

  const teamOptions = teamsData?.teams.filter(notEmpty).map((team) => ({
    label: getLocalizedName(team.displayName, intl),
    value: team.id,
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton color="primary" mode="solid" icon={PlusIcon}>
          {label}
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to add a new team membership to the following user: <strong>{userName}</strong>",
                id: "b9/hHh",
                description: "Lead in text for the add role to user form.",
              },
              { userName },
            )}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddRoles)}>
              <SelectField
                id="team"
                name="team"
                label={intl.formatMessage({
                  defaultMessage: "Team",
                  id: "GaMSN8",
                  description:
                    "Label for the input to select team of a team role",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select team...",
                  id: "ZdOvlC",
                  description: "Placeholder text for team selection input",
                })}
                isLoading={teamsFetching}
                options={teamOptions}
              />
              <MultiSelectField
                id="roles"
                name="roles"
                label={intl.formatMessage({
                  defaultMessage: "Membership role",
                  id: "cJqZoy",
                  description:
                    "Label for the input to select role of a team role",
                })}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select role...",
                  id: "x7vMC8",
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
                    : intl.formatMessage({
                        defaultMessage: "Save changes",
                        id: "UGk7lG",
                        description: "Button to save the roles to a user",
                      })}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddTeamRoleDialog;
