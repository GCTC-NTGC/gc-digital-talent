import { useIntl } from "react-intl";
import ArchiveBoxXMarkIcon from "@heroicons/react/24/solid/ArchiveBoxXMarkIcon";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "urql";

import { Button, Dialog, Heading } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

const ArchiveDepartment_Mutation = graphql(/* GraphQL */ `
  mutation ArchiveDepartment_Mutation($id: ID!) {
    archiveDepartment(id: $id) {
      id
    }
  }
`);

interface ArchiveDepartmentProps {
  departmentId: string;
  departmentNameLocalized: string | null | undefined;
}

interface FormValues {
  departmentName: string;
}

const ArchiveDialog = ({
  departmentId,
  departmentNameLocalized,
}: ArchiveDepartmentProps) => {
  const intl = useIntl();

  const [isOpen, setOpen] = useState<boolean>(false);
  const methods = useForm<FormValues>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const [{ fetching }, executeMutation] = useMutation(
    ArchiveDepartment_Mutation,
  );

  const archiveMutation = async (id: string) => {
    const result = await executeMutation({ id });
    if (result.data?.archiveDepartment) {
      return result.data.archiveDepartment;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };
  const submitHandler = async () => {
    return archiveMutation(departmentId).then(() => {
      setOpen(false);
      toast.success(
        intl.formatMessage({
          defaultMessage: "Department archived",
          id: "Yx8RCD",
          description: "Alert, department archived successfully",
        }),
      );
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <div className="flex justify-center sm:justify-start">
          <Button icon={ArchiveBoxXMarkIcon} color="error">
            {intl.formatMessage({
              defaultMessage: "Archive department",
              id: "H/0zee",
              description:
                "Button to trigger department archiving functionality",
            })}
          </Button>
        </div>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Archive and disable {departmentName} from the platform.",
              id: "oCvKNa",
              description: "Dialog subtitle ",
            },
            { departmentName: departmentNameLocalized },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Archive department",
            id: "v8putB",
            description: "Heading for archiving a department",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Write the department's full name to confirm this action.",
                id: "ICKgvh",
                description:
                  "Sentence explaining how to archive/restore a department",
              })}
            </p>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="mt-6">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Department name",
                      id: "4Nx4Xn",
                      description: "Label for the department name input",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                      validate: (value) =>
                        value === departmentNameLocalized ||
                        intl.formatMessage(
                          {
                            defaultMessage:
                              "Value must match the department's full name: {name}",
                            id: "mWr4O0",
                            description:
                              "Validation text for department name input",
                          },
                          { name: departmentNameLocalized },
                        ),
                    }}
                  />
                </div>
                <Dialog.Footer>
                  <Button
                    type="submit"
                    mode="solid"
                    color="error"
                    disabled={isSubmitting || fetching}
                  >
                    <span>
                      {intl.formatMessage({
                        defaultMessage: "Archive department",
                        id: "H/0zee",
                        description:
                          "Button to trigger department archiving functionality",
                      })}
                    </span>
                  </Button>
                  <Dialog.Close>
                    <Button type="button" color="warning" mode="inline">
                      {intl.formatMessage(formMessages.cancelGoBack)}
                    </Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </form>
            </FormProvider>
          </>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const ArchiveDepartment = ({
  departmentId,
  departmentNameLocalized,
}: ArchiveDepartmentProps) => {
  const intl = useIntl();

  if (!departmentNameLocalized) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center sm:justify-start">
        <Heading level="h2" color="secondary" className="mt-0 mb-7 font-bold">
          {intl.formatMessage({
            defaultMessage: "Archive department",
            id: "v8putB",
            description: "Heading for archiving a department",
          })}
        </Heading>
      </div>
      <p className="mb-7">
        {intl.formatMessage({
          defaultMessage:
            "Archiving this department will remove it as a selectable option across the platform. Anything that already uses it will remain unchanged.",
          id: "E8q/Zm",
          description: "Descriptive text for department archiving",
        })}
      </p>
      <ArchiveDialog
        departmentId={departmentId}
        departmentNameLocalized={departmentNameLocalized}
      />
    </>
  );
};
