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
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

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

type DuplicateProcessDialogProps = ProcessDialogProps & {
  departmentsQuery: FragmentType<typeof DuplicatePoolDepartment_Fragment>[];
  onDuplicate: (opts: {
    department: Scalars["ID"]["output"] | undefined;
  }) => Promise<void>;
};

const DuplicateProcessDialog = ({
  poolName,
  isFetching,
  onDuplicate,
  departmentsQuery,
}: DuplicateProcessDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();
  const departments = getFragment(
    DuplicatePoolDepartment_Fragment,
    departmentsQuery,
  );
  const departmentOptions: Option[] = departments.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));

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
        <Button color="secondary" mode="inline">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
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
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  id: "KP50uT",
                  defaultMessage:
                    "Specify the following information for this new recruitment",
                  description:
                    "Text prompting for input when duplicating a process",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <div data-h2-margin-bottom="base(x1)">
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

              <p data-h2-margin="base(x1, 0)">
                {intl.formatMessage({
                  id: "AZEoFk",
                  defaultMessage:
                    "This will copy all existing information and create a new process.",
                  description:
                    "Text explaining what will happen when duplicating a process",
                })}
              </p>
              <p data-h2-margin="base(x1, 0)">
                {intl.formatMessage({
                  id: "3Rad8l",
                  defaultMessage:
                    "Do you wish to continue? This will navigate away from this page.",
                  description:
                    "Text explaining what will happen after duplicating a pool and confirming the action",
                })}
              </p>

              <Dialog.Footer>
                <Button color="secondary" disabled={isFetching} type="submit">
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
