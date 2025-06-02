import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  CardRepeater,
  Dialog,
  useCardRepeaterContext,
} from "@gc-digital-talent/ui";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import { TextArea } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";

import { FormValues, dataToFormValues, labels } from "./utils";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;

const GeneralQuestionDialog_Fragment = graphql(/* GraphQL */ `
  fragment GeneralQuestionDialog on GeneralQuestion {
    id
    question {
      en
      fr
    }
  }
`);
interface GeneralQuestionDialogProps {
  questionQuery?: FragmentType<typeof GeneralQuestionDialog_Fragment>;
  index?: number;
  disabled?: boolean;
}

const GeneralQuestionDialog = ({
  questionQuery,
  index,
  disabled,
}: GeneralQuestionDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const question = getFragment(GeneralQuestionDialog_Fragment, questionQuery);
  const isUpdate = !!question;
  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(question),
  });
  const { setValue, register, reset } = methods;
  const actionProps = register("action");
  const { append, remove, update } = useCardRepeaterContext();

  const handleSubmit = (values: FormValues) => {
    const isDelete = values.action === "delete";
    const isAdd = values.id === "new";
    if (isDelete) {
      if (typeof index !== "undefined") remove(index);
    } else if (values.id) {
      const newQuestion = {
        en: values.questionEn,
        fr: values.questionFr,
      };
      if (isAdd) {
        append({ id: "new", question: newQuestion });
        reset(dataToFormValues());
      } else if (notEmpty(index)) {
        update(index, {
          id: values.id,
          question: newQuestion,
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        {isUpdate ? (
          <CardRepeater.Edit
            disabled={disabled}
            label={intl.formatMessage(formMessages.repeaterEdit, {
              index,
            })}
          />
        ) : (
          <CardRepeater.Add disabled={disabled}>
            {intl.formatMessage({
              defaultMessage: "Add a new question",
              id: "uEqA50",
              description:
                "Button text to add a new general question to a pool",
            })}
          </CardRepeater.Add>
        )}
      </Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "This form allows you to enter both the English and French text for your question.",
            id: "deE+LO",
            description: "Subtitle for general question dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Manage a general question",
            id: "A2stXT",
            description: "Title for general question dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <input type="hidden" {...methods.register("id")} />
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(1fr 1fr)"
              >
                <div>
                  <TextArea
                    id="questionEn"
                    name="questionEn"
                    label={intl.formatMessage(labels.questionEn)}
                    rows={TEXT_AREA_ROWS}
                    wordLimit={TEXT_AREA_MAX_WORDS}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div>
                  <TextArea
                    id="questionFr"
                    name="questionFr"
                    label={intl.formatMessage(labels.questionFr)}
                    rows={TEXT_AREA_ROWS}
                    wordLimit={TEXT_AREA_MAX_WORDS + 80} // Increase for FR text
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
              </div>
              <Dialog.Footer data-h2-justify-content="base(flex-start)">
                <Button
                  type="submit"
                  color="primary"
                  {...actionProps}
                  onClick={() => setValue("action", "save")}
                >
                  {intl.formatMessage({
                    defaultMessage: "Save this question",
                    id: "oqnkwR",
                    description: "Button text to save a general question",
                  })}
                </Button>
                <Dialog.Close>
                  <Button mode="inline" color="warning">
                    {intl.formatMessage({
                      defaultMessage: "Cancel",
                      id: "FhWYXz",
                      description: "Label for close general question dialog.",
                    })}
                  </Button>
                </Dialog.Close>
                {isUpdate && (
                  <Button
                    type="submit"
                    mode="inline"
                    color="error"
                    {...actionProps}
                    onClick={() => setValue("action", "delete")}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Delete this question",
                      id: "UanJxB",
                      description: "Button text to delete a general question",
                    })}
                  </Button>
                )}
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default GeneralQuestionDialog;
