import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";
import { toast } from "@common/components/Toast";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { Select } from "@common/components/form";
import { commonMessages, errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import {
  Applicant,
  PoolCandidate,
  PoolCandidateStatus,
  UpdatePoolCandidateAsAdminInput,
  useUpdatePoolCandidateMutation,
} from "../../../api/generated";

type FormValues = {
  status: PoolCandidate["status"];
};

export interface ChangeStatusDialogProps {
  selectedCandidate: PoolCandidate;
  user: Applicant;
}

export const ChangeStatusDialog: React.FC<ChangeStatusDialogProps> = ({
  selectedCandidate,
  user,
}) => {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const methods = useForm<FormValues>();

  const [{ fetching }, executeMutation] = useUpdatePoolCandidateMutation();

  const requestMutation = async (
    id: string,
    values: UpdatePoolCandidateAsAdminInput,
  ) => {
    const result = await executeMutation({ id, poolCandidate: values });
    if (result.data?.updatePoolCandidateAsAdmin) {
      return result.data.updatePoolCandidateAsAdmin;
    }
    return Promise.reject(result.error);
  };

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    await requestMutation(selectedCandidate.id, {
      status: formValues.status,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Status updated successfully",
            id: "nYriNg",
            description: "Toast for successful status update on view-user page",
          }),
        );
        setOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating status",
            id: "BnSa6Y",
            description: "Toast for failed status update on view-user page",
          }),
        );
      });
  };
  const { handleSubmit } = methods;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="inline" data-h2-padding="base(0)">
          <span data-h2-text-decoration="base(underline)">
            {intl.formatMessage({
              defaultMessage: "Change status",
              id: "bl7pCx",
              description:
                "Button to change a users status in a pool - located in the table on view-user page",
            })}
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Change status",
            id: "SARjte",
            description: "title for change status dialog on view-user page",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage({
            defaultMessage: "You're about to change status for this user:",
            id: "p+YRN1",
            description:
              "First section of text on the change candidate status dialog",
          })}
        </p>
        <p>- {getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage: "From the following pool:",
            id: "FUxE8S",
            description:
              "Second section of text on the change candidate status dialog",
          })}
        </p>
        <p>- {getFullPoolAdvertisementTitle(intl, selectedCandidate?.pool)}</p>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage: "Choose status:",
            id: "Zbk4zf",
            description:
              "Third section of text on the change candidate status dialog",
          })}
        </p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitForm)}>
            <div data-h2-margin="base(x.5, 0, x.125, 0)">
              <Select
                id="changeStatusDialog-status"
                name="status"
                label={intl.formatMessage({
                  defaultMessage: "Pool status",
                  id: "n9YPWe",
                  description:
                    "Label displayed on the status field of the change candidate status dialog",
                })}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a pool status...",
                  id: "usNShh",
                  description:
                    "Placeholder displayed on the status field of the change candidate status dialog.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={enumToOptions(PoolCandidateStatus)}
              />
            </div>
            <Dialog.Footer>
              <Dialog.Close>
                <Button type="button" mode="outline" color="secondary">
                  <span data-h2-text-decoration="base(underline)">
                    {intl.formatMessage({
                      defaultMessage: "Cancel and go back",
                      id: "tiF/jI",
                      description: "Close dialog button",
                    })}
                  </span>
                </Button>
              </Dialog.Close>

              <Button
                disabled={fetching}
                type="submit"
                mode="solid"
                color="secondary"
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
              >
                {fetching ? (
                  intl.formatMessage(commonMessages.saving)
                ) : (
                  <span data-h2-text-decoration="base(underline)">
                    {intl.formatMessage({
                      defaultMessage: "Change status",
                      id: "iuve97",
                      description:
                        "Confirmation button for change status dialog",
                    })}
                  </span>
                )}
              </Button>
            </Dialog.Footer>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ChangeStatusDialog;
