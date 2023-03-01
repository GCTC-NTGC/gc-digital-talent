import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { PencilIcon } from "@heroicons/react/24/outline";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { MultiSelectField, Select } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import { Role, Team, User } from "~/api/generated";
import { getFullNameLabel } from "~/utils/nameUtils";

import { TeamMemberFormValues } from "./types";

interface EditTeamMemberDialogProps {
  user: User;
  team: Team;
  availableRoles: Array<Role>;
  // onSave: (submitData: TeamMemberSubmitData) => Promise<void>;
}

const EditTeamMemberDialog = ({
  user,
  team,
  availableRoles,
}: // onSave,
EditTeamMemberDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const methods = useForm<TeamMemberFormValues>({
    defaultValues: {
      user: user.id,
      team: team.id,
      roles: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: TeamMemberFormValues) => {
    // await executeMutation({
    // }).then(() => setIsOpen(false));
  };

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
        <Button color="primary" mode="outline" aria-label={label}>
          <PencilIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-secondary">{label}</Dialog.Header>
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
            <Select
              id="userDisplay"
              name="userDisplay"
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
              options={availableRoles.map((role) => ({
                label: getLocalizedName(role.displayName, intl),
                value: role.id,
              }))}
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
                      id: "xDqygb",
                      description:
                        "Button to save the permissions for a user's team membership",
                    })}
              </Button>
            </Dialog.Footer>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditTeamMemberDialog;
