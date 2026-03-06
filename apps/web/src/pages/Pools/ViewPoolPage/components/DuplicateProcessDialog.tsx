import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Option, Select } from "@gc-digital-talent/forms";
import {
  FragmentType,
  RoleAssignment,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { hasRequiredRoles, ROLE_NAME, RoleName } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { ProcessDialogProps } from "./types";

export const DuplicatePoolDepartment_Fragment = graphql(/* GraphQL */ `
  fragment DuplicatePoolDepartment on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);

interface FormValues {
  department: Scalars["ID"]["output"] | undefined;
}

interface DuplicateProcessDialogProps extends ProcessDialogProps {
  departmentsQuery: FragmentType<typeof DuplicatePoolDepartment_Fragment>[];
  onDuplicate: (opts: {
    department: Scalars["ID"]["output"] | undefined;
  }) => Promise<void>;
  roleAssignments: RoleAssignment[];
}

const DuplicateProcessDialog = ({
  poolName,
  isFetching,
  onDuplicate,
  departmentsQuery,
  roleAssignments,
}: DuplicateProcessDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();
  const departments = getFragment(
    DuplicatePoolDepartment_Fragment,
    departmentsQuery,
  );

  // restrict departments to select from based off user's role assignments
  const departmentRoles: RoleName[] = [
    ROLE_NAME.DepartmentAdmin,
    ROLE_NAME.DepartmentHRAdvisor,
  ];
  function isAuthorizedDepartment(
    assignment: RoleAssignment,
  ): assignment is RoleAssignment {
    return (
      !!assignment.role &&
      departmentRoles.includes(assignment.role.name as RoleName)
    );
  }

  let departmentsToDisplay = departments;
  const userDepartmentRoles = roleAssignments.filter(isAuthorizedDepartment);
  const departmentIds = unpackMaybes(
    userDepartmentRoles.map((assignment) => assignment.teamable?.id),
  );
  const hasCommunityRole = hasRequiredRoles({
    toCheck: [{ name: "community_admin" }, { name: "community_recruiter" }],
    userRoles: roleAssignments,
  });
  const hasDepartmentRole = hasRequiredRoles({
    toCheck: [{ name: "department_admin" }, { name: "department_hr_advisor" }],
    userRoles: roleAssignments,
  });

  if (!hasCommunityRole && hasDepartmentRole) {
    // in the case of department role but not community, narrow department options
    departmentsToDisplay = departments.filter((department) =>
      departmentIds.includes(department.id),
    );
  }

  const departmentOptions: Option[] = departmentsToDisplay.map(
    ({ id, name }) => ({
      value: id,
      label: getLocalizedName(name, intl),
    }),
  );

  const title = intl.formatMessage({
    defaultMessage: "Duplicate process",
    id: "NUjAy0",
    description: "Title to duplicate a process",
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      department: "",
    },
  });

  const { handleSubmit } = methods;

  const handleDuplicate = async (values: FormValues) => {
    await onDuplicate(values).then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="inline">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage(
              {
                id: "G7ICNn",
                defaultMessage:
                  "You are about to duplicate this process: {poolName}",
                description: "Text to confirm the process to be duplicated",
              },
              {
                poolName,
              },
            )}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleDuplicate)}>
              <p className="mb-6">
                {intl.formatMessage({
                  id: "KP50uT",
                  defaultMessage:
                    "Specify the following information for this new recruitment",
                  description:
                    "Text prompting for input when duplicating a process",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <div className="mb-6">
                <Select
                  id="department"
                  label={intl.formatMessage({
                    defaultMessage: "Parent department",
                    id: "D/Ymty",
                    description:
                      "Label displayed on the pool form department field.",
                  })}
                  name="department"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a department",
                    id: "y827h2",
                    description:
                      "Null selection for department select input in the request form.",
                  })}
                  options={departmentOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>

              <p className="my-6">
                {intl.formatMessage({
                  id: "AZEoFk",
                  defaultMessage:
                    "This will copy all existing information and create a new process.",
                  description:
                    "Text explaining what will happen when duplicating a process",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage({
                  id: "3Rad8l",
                  defaultMessage:
                    "Do you wish to continue? This will navigate away from this page.",
                  description:
                    "Text explaining what will happen after duplicating a pool and confirming the action",
                })}
              </p>

              <Dialog.Footer>
                <Button color="primary" disabled={isFetching} type="submit">
                  {intl.formatMessage({
                    defaultMessage: "Duplicate and view new process",
                    id: "RZIivj",
                    description: "Button text to duplicate a process",
                  })}
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

export default DuplicateProcessDialog;
