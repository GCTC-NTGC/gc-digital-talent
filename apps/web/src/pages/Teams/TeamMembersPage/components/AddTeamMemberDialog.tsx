import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Combobox, MultiSelectField, Select } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";

import {
  Role,
  Team,
  UserPublicProfile,
  useUpdateUserTeamRolesMutation,
} from "~/api/generated";
import { getFullNameAndEmailLabel } from "~/utils/nameUtils";

import { TeamMemberFormValues } from "./types";
import { getTeamBasedRoleOptions } from "./utils";

interface AddTeamMemberDialogProps {
  team: Team;
  availableUsers: Array<UserPublicProfile> | null;
  availableRoles: Array<Role>;
}

const AddTeamMemberDialog = ({
  team,
  availableRoles,
  availableUsers,
}: // onSave,
AddTeamMemberDialogProps) => {
  const intl = useIntl();
  const [, executeMutation] = useUpdateUserTeamRolesMutation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const methods = useForm<TeamMemberFormValues>({
    defaultValues: {
      userId: "",
      teamId: team.id,
      teamDisplay: team.id, // This form field will be disabled and only used for display purposes.
      roles: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: TeamMemberFormValues) => {
    await executeMutation({
      teamRoleAssignments: {
        userId: formValues.userId,
        teamId: formValues.teamId,
        roleAssignments: {
          attach: {
            roles: formValues.roles,
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
  const userOptions = availableUsers?.map((user) => ({
    value: user.id,
    label: getFullNameAndEmailLabel(
      user.firstName,
      user.lastName,
      user.email,
      intl,
    ),
  }));

  const label = intl.formatMessage({
    defaultMessage: "Add new member",
    id: "+e2nr6",
    description: "Label for the add member to team form",
  });

  const fetchingUsers = availableUsers === null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" icon={PlusIcon}>
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
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
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
              >
                <Combobox
                  id="userId"
                  name="userId"
                  disabled={fetchingUsers}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  label={intl.formatMessage({
                    defaultMessage: "Manager name",
                    id: "1BEtoY",
                    description:
                      "Label for the user select field on team membership form",
                  })}
                  options={userOptions ?? []}
                />
                {/** Note: Only one option since we are adding to this team's users */}
                <input type="hidden" name="teamId" value={team.id} />
                <Select
                  id="teamDisplay"
                  name="teamDisplay"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
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
                    : label}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddTeamMemberDialog;
