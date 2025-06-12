import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";

import { Dialog, Button, Well } from "@gc-digital-talent/ui";
import {
  convertDateTimeZone,
  strToFormDate,
} from "@gc-digital-talent/date-helpers";
import { DateInput, RadioGroup, TextArea } from "@gc-digital-talent/forms";
import {
  apiMessages,
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { Pool, Scalars } from "@gc-digital-talent/graphql";

import { ProcessDialogProps } from "./types";

interface FormValues {
  type?: "extend" | "close";
  expiryEndDate?: Pool["closingDate"];
  reason?: string;
}

type ChangeDateDialogProps = ProcessDialogProps & {
  closingDate?: Pool["closingDate"];
  onExtend: (closingDate: Scalars["DateTime"]["input"]) => Promise<void>;
  onClose: (reason: string) => Promise<void>;
};

const ChangeDateDialog = ({
  poolName,
  closingDate,
  onExtend,
  onClose,
}: ChangeDateDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();
  let minDate = new Date();
  if (closingDate) {
    minDate = new Date(closingDate);
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      type: "extend",
      expiryEndDate: closingDate
        ? new Date(closingDate).toISOString().split("T")[0]
        : "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const type = watch("type");

  const handleChangeDate = useCallback(
    async (formValues: FormValues) => {
      if (formValues.type === "close") {
        await onClose(formValues.reason ?? "").then(() => setIsOpen(false));
      } else {
        const closingDateInUtc = formValues.expiryEndDate
          ? convertDateTimeZone(
              `${formValues.expiryEndDate} 23:59:59`,
              "Canada/Pacific",
              "UTC",
            )
          : "";
        await onExtend(closingDateInUtc).then(() => setIsOpen(false));
      }
    },
    [onClose, onExtend],
  );

  const title = intl.formatMessage({
    defaultMessage: "Change closing date",
    id: "dkiKpU",
    description: "Title to change the closing date of a process",
  });

  const submitMessage =
    type === "extend"
      ? title
      : intl.formatMessage({
          defaultMessage: "Close process immediately",
          id: "3GLqD1",
          description: "Submit button text to close a process",
        });

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
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                id: "t4+h/N",
                defaultMessage:
                  "You are about to change the closing date of this process: <strong>{poolName}</strong>",
                description: "Text to confirm the process to be extend",
              },
              {
                poolName,
              },
            )}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleChangeDate)}>
              <RadioGroup
                id="type"
                idPrefix="type"
                name="type"
                data-h2-margin-bottom="base(x1)"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                legend={intl.formatMessage({
                  defaultMessage: "Type of date change",
                  id: "G6V8wJ",
                  description:
                    "Legend for the radio group to select whether to extend a date or set to now",
                })}
                items={[
                  {
                    label: intl.formatMessage({
                      defaultMessage: "Extend closing date",
                      id: "NTwwfL",
                      description: "Option to extend the pool closing date",
                    }),
                    value: "extend",
                  },
                  {
                    label: intl.formatMessage({
                      defaultMessage: "Close immediately",
                      id: "pXiwEH",
                      description: "Option to close the pool",
                    }),
                    value: "close",
                  },
                ]}
              />
              {type === "extend" ? (
                <DateInput
                  id="expiryEndDate"
                  legend={intl.formatMessage({
                    defaultMessage: "End Date",
                    id: "80DOGy",
                    description:
                      "Label displayed on the pool candidate form end date field.",
                  })}
                  name="expiryEndDate"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: strToFormDate(minDate.toISOString()),
                      message: closingDate
                        ? intl.formatMessage(
                            apiMessages.UpdatePoolClosingDateExtend,
                          )
                        : intl.formatMessage(errorMessages.futureDate),
                    },
                  }}
                />
              ) : (
                <>
                  <p data-h2-margin-bottom="base(x1)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Please write the reason why this process is closing early.",
                      id: "nqNCB/",
                      description:
                        "Helper message for closing the process early",
                    })}
                  </p>
                  <div data-h2-margin-bottom="base(x1)">
                    <TextArea
                      id="reason"
                      label={intl.formatMessage({
                        defaultMessage: "Reason for closing",
                        id: "SQRzSl",
                        description:
                          "Label for the reason for closing the pool",
                      })}
                      name="reason"
                      wordLimit={200}
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                    />
                  </div>
                  <Well color="warning">
                    <p
                      data-h2-font-weight="base(700)"
                      data-h2-margin-bottom="base(x.5)"
                    >
                      {intl.formatMessage(commonMessages.warning)}
                    </p>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Remember to inform any candidate who has already applied to this process.",
                        id: "8EPVUp",
                        description:
                          "Warning message for closing the process early",
                      })}
                    </p>
                  </Well>
                </>
              )}
              <Dialog.Footer>
                <Button
                  type="submit"
                  color={type === "extend" ? "primary" : "error"}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : submitMessage}
                </Button>
                <Dialog.Close>
                  <Button type="button" color="warning" mode="inline">
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

export default ChangeDateDialog;
