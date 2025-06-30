import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import debounce from "lodash/debounce";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { Combobox } from "@gc-digital-talent/forms";
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
  RoleInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import messages from "~/messages/processMessages";
import adminMessages from "~/messages/adminMessages";

import { UpdateUserDataAuthInfoType } from "../UpdateUserPage";
import { isPoolTeamable } from "./helpers";
import useAvailablePools from "./useAvailablePools";

interface FormValues {
  roles: string[];
  pool: string | null;
}

interface AddProcessRoleDialogProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  authInfo: UpdateUserDataAuthInfoType;
  processRoles: Role[];
  onAddRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const AddProcessRoleDialog = ({
  user,
  authInfo,
  processRoles,
  onAddRoles,
}: AddProcessRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, firstName, lastName } = user;
  const userName = getFullNameHtml(firstName, lastName, intl);

  const roleAssignments = authInfo?.roleAssignments ?? [];
  const activePoolIds = roleAssignments
    .filter((ra) => isPoolTeamable(ra?.teamable))
    .map((ra) => {
      if (
        ra?.teamable &&
        isPoolTeamable(ra.teamable) && // type coercion
        ra.role?.isTeamBased
      ) {
        return ra.teamable.id;
      } else {
        return null;
      }
    })
    .filter(notEmpty);

  const [query, setQuery] = useState<string>("");
  const {
    pools,
    total,
    fetching: poolsFetching,
  } = useAvailablePools(
    activePoolIds, // Exclude the pools the user is already assigned to
    {
      name: query || undefined,
    },
  );
  const handleDebouncedSearch = debounce((newQuery: string) => {
    setQuery(newQuery);
  }, 300);
  const poolOptions = pools
    ?.filter((pool) => !!pool.teamIdForRoleAssignment)
    .map((pool) => ({
      value: pool.teamIdForRoleAssignment ?? "", // should never be an empty string, just satisfies type
      label: getLocalizedName(pool.name, intl),
    }));

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: [],
      pool: null,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAddRoles = async (formValues: FormValues) => {
    let { roles } = formValues;
    // despite the typing, roles is just a string may be complicated by there being only one team based role available
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const roleInputArray: RoleInput[] = roles.map((role) => {
      return { roleId: role, teamId: formValues.pool };
    });

    return onAddRoles({
      userId: id,
      roleAssignmentsInput: {
        attach: roleInputArray,
      },
    }).then(() => {
      setIsOpen(false);
      toast.success(intl.formatMessage(adminMessages.rolesAdded));
    });
  };

  const dialogLabel = intl.formatMessage({
    defaultMessage: "Add process role",
    id: "bMfecw",
    description: "Header for the form to add a process membership to a user",
  });

  const buttonLabel = intl.formatMessage({
    defaultMessage: "Add process role",
    id: "TSYfZE",
    description:
      "Button label for the form to add a process membership to a user",
  });

  const roleOptions = processRoles.map((role) => ({
    label: getLocalizedName(role.displayName, intl),
    value: role.id,
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" icon={PlusIcon}>
          {buttonLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{dialogLabel}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "You are about to add roles for the following member:",
              id: "0cevfA",
              description: "Lead in text for the add role to user form.",
            })}
          </p>
          <Ul>
            <li className="font-bold">
              <span>{userName}</span>
            </li>
          </Ul>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "Select the process and roles you want to add",
              id: "CcLolQ",
              description:
                "Lead in text for the pick process and roles inputs.",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddRoles)}>
              <div className="flex flex-col gap-y-6">
                <Combobox
                  id="pool"
                  name="pool"
                  fetching={poolsFetching}
                  isExternalSearch
                  onSearch={handleDebouncedSearch}
                  total={total}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  label={intl.formatMessage(messages.process)}
                  options={poolOptions ?? []}
                />
                <Combobox
                  id="roles"
                  name="roles"
                  isMulti
                  label={intl.formatMessage({
                    defaultMessage: "Process roles",
                    id: "eGqjYh",
                    description: "Heading for updating a user's process roles",
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
                  <Button color="primary">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
                <Button
                  mode="solid"
                  color="primary"
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

export default AddProcessRoleDialog;
