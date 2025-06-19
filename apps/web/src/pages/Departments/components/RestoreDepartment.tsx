import { useIntl } from "react-intl";
import DocumentArrowUpIcon from "@heroicons/react/24/solid/DocumentArrowUpIcon";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "urql";

import { Button, Dialog, Heading } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

const UnarchiveDepartment_Mutation = graphql(/* GraphQL */ `
  mutation UnarchiveDepartment_Mutation($id: ID!) {
    unarchiveDepartment(id: $id) {
      id
    }
  }
`);

interface RestoreDepartmentProps {
  departmentId: string;
  departmentNameLocalized: string | null | undefined;
}

interface FormValues {
  departmentName: string;
}

const RestoreDialog = ({
  departmentId,
  departmentNameLocalized,
}: RestoreDepartmentProps) => {
  const intl = useIntl();

  const [isOpen, setOpen] = useState<boolean>(false);
  const methods = useForm<FormValues>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const [{ fetching }, executeMutation] = useMutation(
    UnarchiveDepartment_Mutation,
  );

  const restoreMutation = async (id: string) => {
    const result = await executeMutation({ id });
    if (result.data?.unarchiveDepartment) {
      return result.data.unarchiveDepartment;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };
  const submitHandler = async () => {
    return restoreMutation(departmentId).then(() => {
      setOpen(false);
      toast.success(
        intl.formatMessage({
          defaultMessage: "Department restored",
          id: "+12z1r",
          description: "Alert, department restored successfully",
        }),
      );
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <div className="flex justify-center sm:justify-start">
          <Button icon={DocumentArrowUpIcon} color="warning">
            {intl.formatMessage({
              defaultMessage: "Restore department",
              id: "WNgaJf",
              description:
                "Button to trigger department restoring functionality",
            })}
          </Button>
        </div>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Restore and enable {departmentName} on the platform.",
              id: "5uPSDe",
              description: "Dialog subtitle ",
            },
            { departmentName: departmentNameLocalized },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Restore department",
            id: "qUkDNj",
            description: "Heading for restoring a department",
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
                    color="warning"
                    disabled={isSubmitting || fetching}
                  >
                    <span>
                      {intl.formatMessage({
                        defaultMessage: "Restore department",
                        id: "WNgaJf",
                        description:
                          "Button to trigger department restoring functionality",
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

export const RestoreDepartment = ({
  departmentId,
  departmentNameLocalized,
  archivedAt,
}: RestoreDepartmentProps & { archivedAt: string }) => {
  const intl = useIntl();

  const formattedDate = formatDate({
    date: parseDateTimeUtc(archivedAt),
    formatString: "yyyy-MM-dd",
    intl,
  });

  if (!departmentNameLocalized) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center sm:justify-start">
        <Heading level="h2" color="secondary" className="mt-0 mb-7 font-bold">
          {intl.formatMessage({
            defaultMessage: "Restore department",
            id: "qUkDNj",
            description: "Heading for restoring a department",
          })}
        </Heading>
      </div>
      <p className="mb-7">
        {intl.formatMessage({
          defaultMessage:
            "This will remove the department from the archive and restore it on the platform. All its previous information will be available again.",
          id: "VC9Tuf",
          description: "Descriptive text for department restoring",
        })}
      </p>
      <div className="mb-7">
        <span>
          {intl.formatMessage({
            defaultMessage: "This department was archived on: ",
            id: "99pUA+",
            description: "Label for archived date",
          })}
        </span>
        <span className="font-bold">{formattedDate}</span>
      </div>
      <RestoreDialog
        departmentId={departmentId}
        departmentNameLocalized={departmentNameLocalized}
      />
    </>
  );
};
