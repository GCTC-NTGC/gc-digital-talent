import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Dialog, Button, IconButton, Ul } from "@gc-digital-talent/ui";
import { Combobox } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { Scalars, Maybe } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { COMMUNITY_ROLES, RoleName } from "@gc-digital-talent/auth";

import { getFullNameHtml } from "~/utils/nameUtils";
import RolesAndPermissionsPageMessage from "~/components/RolesAndPermissionsPageMessage/RolesAndPermissionsPageMessage";

import {
  CommunityAssignment,
  getRoleTableFragments,
  RoleTableProps,
  useUpdateRolesMutation,
} from "../utils";

interface FormValues {
  roleIds: Scalars["UUID"]["input"][];
  teamId: Maybe<Scalars["UUID"]["input"]>;
  userId: Scalars["UUID"]["input"];
}

interface EditCommunityRoleDialogProps extends RoleTableProps {
  assignment: CommunityAssignment;
}

const EditCommunityRoleDialog = ({
  query,
  optionsQuery,
  assignment,
}: EditCommunityRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initialRoleIds = unpackMaybes(assignment.roles.flatMap((r) => r.id));
  const { user, options } = getRoleTableFragments({ query, optionsQuery });
  const { updateRoles, methods, fetching } = useUpdateRolesMutation<FormValues>(
    {
      userId: user.id,
      teamId: assignment.community.teamIdForRoleAssignment,
      roleIds: initialRoleIds,
    },
  );

  const userName = getFullNameHtml(user.firstName, user.lastName, intl);

  const handleSubmit = async (values: FormValues) => {
    const rolesToAttach = values.roleIds.filter(
      (role) => !initialRoleIds.includes(role),
    );
    const rolesToAttachArray = rolesToAttach.map((role) => {
      return { roleId: role, teamId: values.teamId };
    });
    const rolesToDetach = initialRoleIds.filter(
      (role) => !values.roleIds.includes(role),
    );
    const rolesToDetachArray = rolesToDetach.map((role) => {
      return { roleId: role, teamId: values.teamId };
    });

    await updateRoles({
      userId: user.id,
      roleAssignmentsInput: {
        attach: rolesToAttachArray.length ? rolesToAttachArray : undefined,
        detach: rolesToDetachArray.length ? rolesToDetachArray : undefined,
      },
    }).then(() => {
      setIsOpen(false);
    });
  };

  const label = intl.formatMessage({
    defaultMessage: "Edit community roles",
    id: "PsGkXc",
    description: "Label for the form to edit a users community membership",
  });

  const communityRoles = options.filter(
    (role) =>
      role.isTeamBased && COMMUNITY_ROLES.includes(role.name as RoleName),
  );

  const roleOptions = communityRoles.map((role) => ({
    label:
      role.displayName?.localized ??
      intl.formatMessage(commonMessages.notAvailable),
    value: role.id,
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton color="primary" icon={PencilSquareIcon} label={label} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <RolesAndPermissionsPageMessage />
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "You are about to edit roles for the following member:",
              id: "nBaT85",
              description: "Lead in text for the edit roles on user form.",
            })}
          </p>
          <Ul>
            <li className="font-bold">
              <span>{userName}</span>
            </li>
          </Ul>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "From the following community:",
              id: "hJDRa/",
              description: "Follow in text for the community being updated",
            })}
          </p>
          <Ul>
            <li className="font-bold">
              <span>
                {assignment.community.name?.localized ??
                  intl.formatMessage(commonMessages.notAvailable)}
              </span>
            </li>
          </Ul>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "Select the roles you want to keep",
              id: "47YSK0",
              description: "Role editing details",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Combobox
                id="roleIds"
                name="roleIds"
                isMulti
                label={intl.formatMessage({
                  defaultMessage: "Community roles",
                  id: "6UiKYE",
                  description:
                    "Label for the input to select role of a community role",
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
                <Button mode="solid" color="primary" type="submit">
                  {fetching
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

export default EditCommunityRoleDialog;
