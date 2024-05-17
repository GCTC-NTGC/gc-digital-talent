import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useQuery } from "urql";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
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
  graphql,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

const AddTeamRoleTeams_Query = graphql(/* GraphQL */ `
  query AddTeamRoleTeams {
    teams {
      id
      displayName {
        en
        fr
      }
    }
  }
`);

type FormValues = {
  roles: Array<string>;
  team: string | null;
};

interface AddTeamRoleDialogProps {
  user: User;
  availableRoles: Array<Role>;
  onAddRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const AddTeamRoleDialog = ({
  user,
  availableRoles,
  onAddRoles,
}: AddTeamRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const userName = getFullNameHtml(user.firstName, user.lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: [],
      team: null,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleAddRoles = async (formValues: FormValues) => {
    return onAddRoles({
      userId: user.id,
      roleAssignmentsInput: {
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

  const teamId = watch("team");
  useEffect(() => {
    const roleAssignments = user?.authInfo?.roleAssignments || [];
    const activeRoleIds = roleAssignments
      .filter((ra) => ra?.team?.id === teamId)
      .map((r) => r?.role?.id)
      .filter(notEmpty);
    setValue("roles", activeRoleIds);
  }, [user?.authInfo?.roleAssignments, teamId, setValue]);

  const [{ data: teamsData }] = useQuery({
    query: AddTeamRoleTeams_Query,
  });

  const teamOptions = teamsData?.teams.filter(notEmpty).map((team) => ({
    label: getLocalizedName(team.displayName, intl),
    value: team.id,
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" icon={PlusIcon}>
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to add roles for the following user: <strong>{userName}</strong>",
                id: "w2BYFi",
                description: "Lead in text for the add role to user form.",
              },
              { userName },
            )}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddRoles)}>
              <div
                className="flex"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
              >
                <Select
                  id="team"
                  name="team"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select team",
                    id: "5C8xs4",
                    description: "Placeholder text for team selection input",
                  })}
                  label={intl.formatMessage(adminMessages.team)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={teamOptions ?? []}
                />
                <Combobox
                  id="roles"
                  name="roles"
                  label={intl.formatMessage({
                    defaultMessage: "Membership roles",
                    id: "s5hTYo",
                    description:
                      "Label for the input to select role of a team role",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select role",
                    id: "mTsq+x",
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

export default AddTeamRoleDialog;
