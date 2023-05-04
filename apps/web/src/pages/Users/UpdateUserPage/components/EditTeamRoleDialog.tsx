import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { MultiSelectField } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import {
  Role,
  User,
  Team,
  Scalars,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
} from "~/api/generated";
import { getFullNameHtml } from "~/utils/nameUtils";

type FormValues = {
  roles: Array<Scalars["UUID"]>;
};

interface EditTeamRoleDialogProps {
  user: User;
  initialRoles: Array<Role>;
  allRoles: Array<Role>;
  team: Team;
  onEditRoles: (
    submitData: UpdateUserAsAdminInput,
  ) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
}

const EditTeamRoleDialog = ({
  user,
  initialRoles,
  allRoles,
  team,
  onEditRoles,
}: EditTeamRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const userDisplayName = getFullNameHtml(user.firstName, user.lastName, intl);
  const teamDisplayName = getLocalizedName(team.displayName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: initialRoles.map((role) => role.id),
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleEditRoles = async (formValues: FormValues) => {
    return onEditRoles({
      roleAssignmentsInput: {
        sync: {
          roles: formValues.roles,
          team: team.id,
        },
      },
    })
      .then(() => {
        setIsOpen(false);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Member roles updated successfully",
            id: "ALIgEC",
            description:
              "Alert displayed to user when a team member's roles have been updated",
          }),
        );
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

  const label = intl.formatMessage(
    {
      defaultMessage: "Edit membership for {userName}",
      id: "oVgVhK",
      description: "Label for the form to edit a users team membership",
    },
    {
      userName: userDisplayName,
    },
  );

  const roleOptions = allRoles
    .filter((role) => role.isTeamBased)
    .map((role) => ({
      label: getLocalizedName(role.displayName, intl),
      value: role.id,
    }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="outline">
          <PencilIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
          <span data-h2-visually-hidden="base(hidden)">{label}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to update roles for the following user: <strong>{userDisplayName}</strong>",
                id: "jfED66",
                description: "Lead in text for the add role to user form.",
              },
              { userDisplayName },
            )}
          </p>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "From the following team: <strong>{teamDisplayName}</strong>",
                id: "86qwfg",
                description: "Follow in text for the team being updated",
              },
              { teamDisplayName },
            )}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleEditRoles)}>
              <MultiSelectField
                id="roles"
                name="roles"
                label={intl.formatMessage({
                  defaultMessage: "Membership roles",
                  id: "s5hTYo",
                  description:
                    "Label for the input to select role of a team role",
                })}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select role",
                  id: "mTsq+x",
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
                    : intl.formatMessage(formMessages.saveChanges)}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditTeamRoleDialog;
