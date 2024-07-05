import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useMutation } from "urql";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  RoleInput,
  TeamMembersPage_TeamFragment as TeamMembersPageTeamFragmentType,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import { TeamMember } from "~/utils/teamUtils";
import adminMessages from "~/messages/adminMessages";

import { TeamMemberFormValues } from "./types";
import { getTeamBasedRoleOptions } from "./utils";
import useAvailableRoles from "./useAvailableRoles";
import { UpdateUserTeamRoles_Mutation } from "./operations";

interface EditTeamMemberDialogProps {
  user: TeamMember;
  team: TeamMembersPageTeamFragmentType;
}

const EditTeamMemberDialog = ({ user, team }: EditTeamMemberDialogProps) => {
  const intl = useIntl();
  const { roles, fetching } = useAvailableRoles();
  const [, executeMutation] = useMutation(UpdateUserTeamRoles_Mutation);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initialRolesIds = user.roles.map((role) => role.id);

  const methods = useForm<TeamMemberFormValues>({
    defaultValues: {
      userId: user.id,
      userDisplay: user.id,
      teamId: team.id,
      teamDisplay: team.id,
      roles: initialRolesIds,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: TeamMemberFormValues) => {
    const rolesToAttach = formValues.roles.filter(
      (role) => !initialRolesIds.includes(role),
    );
    const rolesToAttachArray: RoleInput[] = rolesToAttach.map((role) => {
      return { roleId: role, teamId: team.id };
    });
    const rolesToDetach = initialRolesIds.filter(
      (role) => !formValues.roles.includes(role),
    );
    const rolesToDetachArray: RoleInput[] = rolesToDetach.map((role) => {
      return { roleId: role, teamId: team.id };
    });

    await executeMutation({
      updateUserRolesInput: {
        userId: formValues.userId,
        roleAssignmentsInput: {
          attach: rolesToAttachArray.length ? rolesToAttachArray : undefined,
          detach: rolesToDetachArray.length ? rolesToDetachArray : undefined,
        },
      },
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Member roles updated successfully",
              id: "ALIgEC",
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

  const roleOptions = getTeamBasedRoleOptions(roles, intl);

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);

  const label = intl.formatMessage(
    {
      defaultMessage: "Edit membership for {userName}",
      id: "oVgVhK",
      description: "Label for the form to edit a users team membership",
    },
    {
      userName,
    },
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" aria-label={label}>
          <PencilIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Change or remove this membership's permissions.",
              id: "qPxrKm",
              description: "Help text for the edit team membership form",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              {/** Note: Only one option since we are editing this user */}
              <input type="hidden" name="userId" value={user.id} />
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
              >
                <Select
                  id="userDisplay"
                  name="userDisplay"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  disabled
                  label={intl.formatMessage({
                    defaultMessage: "Manager name",
                    id: "1BEtoY",
                    description:
                      "Label for the user select field on team membership form",
                  })}
                  options={[
                    {
                      value: user.id,
                      label: userName,
                    },
                  ]}
                />
                {/** Note: Only one option since we are editing this team's users */}
                <input type="hidden" name="teamId" value={team.id} />
                <Select
                  id="teamDisplay"
                  name="teamDisplay"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  disabled
                  label={intl.formatMessage(adminMessages.team)}
                  options={[
                    {
                      value: team.id,
                      label: getLocalizedName(team.displayName, intl),
                    },
                  ]}
                />
                <Combobox
                  id="roles"
                  name="roles"
                  isMulti
                  fetching={fetching}
                  label={intl.formatMessage({
                    defaultMessage: "Membership roles",
                    id: "cOJVBW",
                    description:
                      "Label for the input to add roles to a user's team membership",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select roles",
                    id: "Cn73yN",
                    description: "Placeholder text for role selection input",
                  })}
                  options={roleOptions}
                />
              </div>
              <Dialog.Footer>
                <Button color="secondary" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Dialog.Close>
                  <Button color="warning" mode="inline">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditTeamMemberDialog;
