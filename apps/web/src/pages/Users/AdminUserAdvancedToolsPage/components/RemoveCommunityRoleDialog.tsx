import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { FormProvider } from "react-hook-form";

import {
  Dialog,
  Button,
  Chip,
  Chips,
  IconButton,
  Ul,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { Role, RoleInput, Scalars, Maybe } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

import {
  CommunityTeamable,
  getUserRoleDialogFragment,
  UserRoleDialogBaseProps,
  useUpdateRolesMutation,
} from "../utils";

interface FormValues {
  roleIds: Scalars["UUID"]["input"][];
  teamId: Maybe<Scalars["UUID"]["input"]>;
  userId: Scalars["UUID"]["input"];
}

interface RemoveCommunityRoleDialogProps extends UserRoleDialogBaseProps {
  community: CommunityTeamable;
  roles: Role[];
}

const RemoveCommunityRoleDialog = ({
  query,
  community,
  roles,
}: RemoveCommunityRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = getUserRoleDialogFragment(query);
  const { updateRoles, methods, fetching } = useUpdateRolesMutation<FormValues>(
    { userId: user.id, teamId: community.teamIdForRoleAssignment },
  );

  const handleSubmit = async (values: FormValues) => {
    const roleInput: RoleInput[] = roles.map((r) => {
      return { roleId: r.id, teamId: values.teamId };
    });
    await updateRoles({
      userId: values.userId,
      roleAssignmentsInput: { detach: roleInput },
    }).then(() => setIsOpen(false));
  };

  const userName = getFullNameHtml(user.firstName, user.lastName, intl);

  const buttonLabel = intl.formatMessage({
    defaultMessage: "Remove from community",
    id: "uG1ZWN",
    description:
      "Button label for the form to remove a community role from a user",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton color="error" icon={TrashIcon} label={buttonLabel} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Remove from community",
            id: "xjdD1/",
            description:
              "Header for the form to remove a community role from a user",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage: "You are about to remove this member:",
              id: "95aNQ1",
              description: "Lead in text for removing roles on user form.",
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
                {community.name?.localized ??
                  intl.formatMessage(commonMessages.notAvailable)}
              </span>
            </li>
          </Ul>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "The user will lose all the following community roles:",
              id: "zsOKOD",
              description:
                "Text notifying user which community roles will be removed from the user",
            })}
          </p>
          <Chips>
            {roles.map((r) => (
              <Chip color="secondary" key={r.id}>
                {r.displayName?.localized ??
                  intl.formatMessage(commonMessages.notAvailable)}
              </Chip>
            ))}
          </Chips>
          <p className="my-6">
            {intl.formatMessage(uiMessages.confirmContinue)}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Dialog.Footer>
                <Button type="submit" color="error">
                  {fetching
                    ? intl.formatMessage(commonMessages.removing)
                    : buttonLabel}
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

export default RemoveCommunityRoleDialog;
