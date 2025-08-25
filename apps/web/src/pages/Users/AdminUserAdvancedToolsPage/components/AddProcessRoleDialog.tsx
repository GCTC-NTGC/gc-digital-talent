import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import debounce from "lodash/debounce";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { Combobox } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import { getFullNameHtml } from "~/utils/nameUtils";
import messages from "~/messages/processMessages";

import useAvailablePools from "../useAvailablePools";
import {
  getRoleTableFragments,
  isPoolTeamable,
  RoleTableProps,
  useUpdateRolesMutation,
} from "../utils";

interface FormValues {
  roles: string[];
  pool: string | null;
}

const AddProcessRoleDialog = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, options } = getRoleTableFragments({ query, optionsQuery });
  const { updateRoles, methods, fetching } =
    useUpdateRolesMutation<FormValues>();

  const currentPools = unpackMaybes(
    user.authInfo?.roleAssignments
      ?.filter((assignment) => isPoolTeamable(assignment?.teamable))
      .flatMap((assignment) => assignment?.teamable?.id),
  );

  const [term, setTerm] = useState<string>("");
  const {
    pools,
    total,
    fetching: poolsFetching,
  } = useAvailablePools(
    currentPools, // Exclude the pools the user is already assigned to
    {
      name: term || undefined,
    },
  );

  if (!user) return null;
  const userName = getFullNameHtml(user.firstName, user.lastName, intl);

  const handleDebouncedSearch = debounce((newQuery: string) => {
    setTerm(newQuery);
  }, 300);

  const poolOptions = pools
    ?.filter((pool) => !!pool.teamIdForRoleAssignment)
    .map((pool) => ({
      value: pool.teamIdForRoleAssignment ?? "", // should never be an empty string, just satisfies type
      label: getLocalizedName(pool.name, intl),
    }));

  const handleSubmit = async (formValues: FormValues) => {
    let { roles } = formValues;
    // despite the typing, roles is just a string may be complicated by there being only one team based role available
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const roleInputArray = roles.map((role) => {
      return { roleId: role, teamId: formValues.pool };
    });

    return updateRoles({
      userId: user.id,
      roleAssignmentsInput: {
        attach: roleInputArray,
      },
    }).then(() => {
      setIsOpen(false);
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

  const processRoles = options.filter(
    (role) => role.isTeamBased && role.name === ROLE_NAME.ProcessOperator,
  );
  const roleOptions = processRoles.map((role) => ({
    label:
      role.displayName?.localized ??
      intl.formatMessage(commonMessages.notAvailable),
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
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
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

export default AddProcessRoleDialog;
