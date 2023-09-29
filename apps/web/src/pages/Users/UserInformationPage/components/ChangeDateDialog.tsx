import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { DateInput } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { currentDate } from "@gc-digital-talent/date-helpers";
import { emptyToNull } from "@gc-digital-talent/helpers";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { getFullNameHtml } from "~/utils/nameUtils";
import {
  User,
  PoolCandidate,
  UpdatePoolCandidateAsAdminInput,
  useUpdatePoolCandidateMutation,
} from "~/api/generated";

type FormValues = {
  expiryDate: PoolCandidate["expiryDate"];
};

interface ChangeDateDialogProps {
  selectedCandidate: PoolCandidate;
  user: User;
}

const ChangeDateDialog = ({
  selectedCandidate,
  user,
}: ChangeDateDialogProps) => {
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
      expiryDate: formValues.expiryDate || emptyToNull(formValues.expiryDate),
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Expiry date updated successfully",
            id: "HwPuG0",
            description:
              "Toast for successful expiry date update on view-user page",
          }),
        );
        setOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating expiry date",
            id: "qSTIKZ",
            description:
              "Toast for failed expiry date update on view-user page",
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
            {selectedCandidate?.expiryDate
              ? selectedCandidate.expiryDate
              : intl.formatMessage({
                  defaultMessage: "Change date",
                  id: "DspBFX",
                  description: "Command to change a date",
                })}
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Expiry Date",
            id: "zDO6tt",
            description:
              "title for change expiry date dialog on view-user page",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You're about to change the expiry date for this user:",
              id: "JjTGYe",
              description:
                "First section of text on the change candidate expiry date dialog",
            })}
          </p>
          <p data-h2-font-weight="base(800)">
            - {getFullNameHtml(user.firstName, user.lastName, intl)}
          </p>
          <p data-h2-margin="base(x1, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage: "On the following pool:",
              id: "jIlwJ8",
              description:
                "Second section of text on the change candidate expiry date dialog",
            })}
          </p>
          <p data-h2-font-weight="base(800)">
            - {getFullPoolTitleHtml(intl, selectedCandidate.pool)}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
              <p data-h2-margin="base(x1, 0, 0, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Set an expiry date for this candidate on this pool:",
                  id: "9NDM+k",
                  description:
                    "Third section of text on the add user to pool dialog",
                })}
              </p>
              <div data-h2-margin="base(x.5, 0, x.125, 0)">
                <DateInput
                  id="changeDateDialog-expiryDate"
                  legend={intl.formatMessage({
                    defaultMessage: "Expiry date",
                    id: "WAO4vD",
                    description:
                      "Label displayed on the date field of the change candidate expiry date dialog",
                  })}
                  name="expiryDate"
                  rules={{
                    min: {
                      value: currentDate(),
                      message: intl.formatMessage(errorMessages.futureDate),
                    },
                  }}
                />
              </div>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button type="button" color="secondary">
                    <span data-h2-text-decoration="base(underline)">
                      {intl.formatMessage(formMessages.cancelGoBack)}
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
                        defaultMessage: "Change date",
                        id: "DspBFX",
                        description: "Command to change a date",
                      })}
                    </span>
                  )}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ChangeDateDialog;
