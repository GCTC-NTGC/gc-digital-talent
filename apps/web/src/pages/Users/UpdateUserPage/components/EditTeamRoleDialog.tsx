import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Combobox } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  UpdateUserRolesInput,
  UpdateUserRolesMutation,
  Role,
  User,
  Team,
  Scalars,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

type FormValues = {
  roles: Array<Scalars["UUID"]["output"]>;
};

interface EditTeamRoleDialogProps {
  user: User;
  initialRoles: Array<Role>;
  allRoles: Array<Role>;
  team: Team;
  onEditRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const EditTeamRoleDialog = ({
  user,
  initialRoles,
  allRoles,
  team,
  onEditRoles,
}: EditTeamRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const userDisplayName = getFullNameHtml(user.firstName, user.lastName, intl);
  const teamDisplayName = getLocalizedName(team.displayName, intl);
  const initialRolesIds = initialRoles.map((role) => role.id);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: initialRolesIds,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleEditRoles = async (formValues: FormValues) => {
    const rolesToAttach = formValues.roles.filter(
      (role) => !initialRolesIds.includes(role),
    );
    const rolesToDetach = initialRolesIds.filter(
      (role) => !formValues.roles.includes(role),
    );

    return onEditRoles({
      userId: user.id,
      roleAssignmentsInput: {
        attach: rolesToAttach.length
          ? {
              roles: rolesToAttach,
              team: team.id,
            }
          : undefined,
        detach: rolesToDetach.length
          ? {
              roles: rolesToDetach,
              team: team.id,
            }
          : undefined,
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
    .filter(
      (role) =>
        ![
          "community_admin",
          "community_recruiter",
          "process_operator",
        ].includes(role.name),
    ) // These roles are meant to be connected to different kinds of Teams.
    .map((role) => ({
      label: getLocalizedName(role.displayName, intl),
      value: role.id,
    }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="black">
          <PencilIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
          <span data-h2-visually-hidden="base(invisible)">{label}</span>
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
              <Combobox
                id="roles"
                name="roles"
                isMulti
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
                  <Button color="secondary">
                    {intl.formatMessage(formMessages.cancelGoBack)}
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
