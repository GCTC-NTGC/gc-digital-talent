import { useState } from "react";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { DateInput } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  strToFormDate,
  DATE_FORMAT_STRING,
  formDateStringToDate,
  formatDate,
} from "@gc-digital-talent/date-helpers";

import applicationMessages from "~/messages/applicationMessages";
import FormChangeNotifyWell from "~/components/FormChangeNotifyWell/FormChangeNotifyWell";

interface FormValues {
  expiryDate: string;
}

const ChangeExpiryDate_Mutation = graphql(/* GraphQL */ `
  mutation ChangeExpiryDate(
    $id: UUID!
    $poolCandidate: UpdatePoolCandidateStatusInput!
  ) {
    updatePoolCandidateStatus(id: $id, poolCandidate: $poolCandidate) {
      id
      expiryDate
    }
  }
`);

const CandidateExpiryDateDialog_Fragment = graphql(/* GraphQL */ `
  fragment CandidateExpiryDateDialog on PoolCandidate {
    id
    expiryDate
    status {
      value
    }
  }
`);

interface ChangeExpiryDateDialogProps {
  expiryDateQuery: FragmentType<typeof CandidateExpiryDateDialog_Fragment>;
}

const ChangeExpiryDateDialog = ({
  expiryDateQuery,
}: ChangeExpiryDateDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const application = getFragment(
    CandidateExpiryDateDialog_Fragment,
    expiryDateQuery,
  );

  const [{ fetching }, changeExpiryDate] = useMutation(
    ChangeExpiryDate_Mutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      expiryDate: application.expiryDate ?? "",
    },
  });

  const { handleSubmit } = methods;

  if (
    !application.expiryDate ||
    application.status?.value !== ApplicationStatus.Qualified
  ) {
    return null;
  }

  const submitHandler = async (data: FormValues) => {
    await changeExpiryDate({
      id: application.id,
      poolCandidate: {
        expiryDate: data.expiryDate,
      },
    })
      .then((res) => {
        if (res.data?.updatePoolCandidateStatus?.id) {
          methods.resetField("expiryDate", {
            defaultValue: res.data.updatePoolCandidateStatus.expiryDate ?? "",
          });
          toast.success(
            intl.formatMessage({
              defaultMessage: "Expiry date updated successfully",
              id: "XrRt6V",
              description: "Success message for updating expiry date",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed to update expiry date",
            id: "Se2I7I",
            description: "Error message for updating expiry date",
          }),
        );
      });

    setIsOpen(false);
  };

  const title = intl.formatMessage({
    defaultMessage: "Change expiry date",
    id: "V9uhhO",
    description: "Title for the change expiry date dialog",
  });

  const formattedDate =
    formatDate({
      date: formDateStringToDate(application.expiryDate),
      formatString: DATE_FORMAT_STRING,
      intl,
    }) || title;

  const todayDate = new Date();

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          mode="text"
          color="secondary"
          aria-label={intl.formatMessage(
            {
              defaultMessage: "Expiry date: {date}. Edit.",
              id: "z4xCCg",
              description: "Button text to edit an expiry date",
            },
            { date: formattedDate },
          )}
        >
          {formattedDate}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <DateInput
                id="expiryDate"
                name="expiryDate"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: strToFormDate(todayDate.toISOString()),
                    message: intl.formatMessage(errorMessages.futureDate),
                  },
                }}
                legend={intl.formatMessage({
                  defaultMessage: "Expiry date",
                  id: "THBjEx",
                  description: "Label for the expiry date input",
                })}
                context={intl.formatMessage({
                  defaultMessage:
                    "This is the amount of time this candidate will be considered for placement based on the results of this process. The usual amount of time is 2 years.",
                  id: "YCv/4v",
                  description: "Help text for setting a candidate expiry date",
                })}
              />
              <FormChangeNotifyWell className="mt-6" />
              <Dialog.Footer>
                <Button type="submit" color="primary" disabled={fetching}>
                  {intl.formatMessage(applicationMessages.saveContinue)}
                </Button>
                <Dialog.Close>
                  <Button mode="inline" color="primary">
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

export default ChangeExpiryDateDialog;
