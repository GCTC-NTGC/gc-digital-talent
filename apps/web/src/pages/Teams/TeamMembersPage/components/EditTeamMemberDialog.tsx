import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { MultiSelectField, Select } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";

import { Role, Team, useUpdateUserAsAdminMutation } from "~/api/generated";
import { getFullNameLabel } from "~/utils/nameUtils";
import { TeamMember } from "~/utils/teamUtils";

import { TeamMemberFormValues } from "./types";
import { getTeamBasedRoleOptions } from "./utils";

interface EditTeamMemberDialogProps {
  user: TeamMember;
  team: Team;
  availableRoles: Array<Role>;
}

const EditTeamMemberDialog = ({
  user,
  team,
  availableRoles,
}: EditTeamMemberDialogProps) => {
  const intl = useIntl();
  const [, executeMutation] = useUpdateUserAsAdminMutation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const methods = useForm<TeamMemberFormValues>({
    defaultValues: {
      user: user.id,
      userDisplay: user.id,
      team: team.id,
      teamDisplay: team.id,
      roles: user.roles.map((role) => role.id),
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
        roleAssignmentsInput: {
          sync: {
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

  const roleOptions = getTeamBasedRoleOptions(availableRoles, intl);

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
              <input type="hidden" name="user" value={user.id} />
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
                <input type="hidden" name="team" value={team.id} />
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

export default EditTeamMemberDialog;
