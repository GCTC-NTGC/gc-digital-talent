import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
  strToFormDate,
} from "@gc-digital-talent/date-helpers";
import { DateInput } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import Footer from "./Footer";

const ApplicationExpiryDateDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationExpiryDateDialog on PoolCandidate {
    id
    expiryDate
  }
`);

const ApplicationExpiryDateDialog_Mutation = graphql(/** GraphQL */ `
  mutation UpdateApplicationExpiryDate($id: UUID!, $expiryDate: Date!) {
    updatePoolCandidateExpiryDate(id: $id, expiryDate: $expiryDate) {
      id
      expiryDate
    }
  }
`);

interface FormValues {
  expiryDate: Scalars["Date"]["input"];
}

interface ApplicationExpiryDateDialogProps {
  query: FragmentType<typeof ApplicationExpiryDateDialog_Fragment>;
}

const ApplicationExpiryDateDialog = ({
  query,
}: ApplicationExpiryDateDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const application = getFragment(ApplicationExpiryDateDialog_Fragment, query);
  const [, updateDate] = useMutation(ApplicationExpiryDateDialog_Mutation);

  const methods = useForm<FormValues>({
    defaultValues: {
      expiryDate: application.expiryDate ?? "",
    },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update expiry date",
        id: "Se2I7I",
        description: "Error message for updating expiry date",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    await updateDate({ id: application.id, expiryDate: values.expiryDate })
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        methods.resetField("expiryDate", {
          defaultValue: res.data.updatePoolCandidateExpiryDate.expiryDate ?? "",
        });

        toast.success(
          intl.formatMessage({
            defaultMessage: "Expiry date updated successfully",
            id: "XrRt6V",
            description: "Success message for updating expiry date",
          }),
        );

        setOpen(false);
      })
      .catch(handleError);
  };

  const title = intl.formatMessage({
    defaultMessage: "Change expiry date",
    id: "V9uhhO",
    description: "Title for the change expiry date dialog",
  });

  const formattedDate =
    formatDate({
      date: parseDateTimeUtc(application.expiryDate),
      formatString: DATE_FORMAT_STRING,
      intl,
    }) || title;

  const todayDate = new Date();

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          mode="text"
          color="success"
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
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Manage how long this candidate will participate in this pool.",
            id: "kPQVe/",
            description:
              "Subtitle for dialog to update an application expiry date",
          })}
        >
          {title}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <DateInput
                id="expiryDate"
                name="expiryDate"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: strToFormDate(todayDate.toISOString()),
                    message: intl.formatMessage(
                      errorMessages.mustNotBePastExpiryDate,
                    ),
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
              <Footer />
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationExpiryDateDialog;
