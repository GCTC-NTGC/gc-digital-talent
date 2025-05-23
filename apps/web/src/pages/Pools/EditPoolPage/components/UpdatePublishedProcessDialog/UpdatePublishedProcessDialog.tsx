import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { Button, Dialog, Heading, Well } from "@gc-digital-talent/ui";
import {
  FragmentType,
  UpdatePublishedPoolInput,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import TextArea from "@gc-digital-talent/forms/TextArea";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";

import { PublishedEditableSectionProps } from "../../types";

const UpdatePublishedProcessDialog_Fragment = graphql(/* GraphQL */ `
  fragment UpdatePublishedProcessDialog on Pool {
    id
    workStream {
      id
      name {
        en
        fr
      }
    }
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    name {
      en
      fr
    }
    classification {
      id
      group
      level
    }
  }
`);

export type FormValues = UpdatePublishedPoolInput;

interface UpdatePublishedProcessDialogProps
  extends PublishedEditableSectionProps {
  poolQuery: FragmentType<typeof UpdatePublishedProcessDialog_Fragment>;
}

const UpdatePublishedProcessDialog = ({
  onUpdatePublished,
  poolQuery,
}: UpdatePublishedProcessDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pool = getFragment(UpdatePublishedProcessDialog_Fragment, poolQuery);
  const title = getShortPoolTitleHtml(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      changeJustification: "",
    },
  });

  const handleUpdate = async (values: FormValues) => {
    await onUpdatePublished(values).then(() => {
      setIsOpen(false);
    });
  };

  const handleSave = async () => {
    await methods.handleSubmit(handleUpdate)();
  };

  const label = intl.formatMessage({
    defaultMessage: "Change justification",
    id: "XGztC+",
    description: "Heading for form to justify updating a published process",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button>{intl.formatMessage(formMessages.saveChanges)}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <Well color="warning" data-h2-margin-bottom="base(x1)">
            <Heading level="h3" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage(commonMessages.warning)}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You are about to change information currently published on the following advertisement",
                id: "4lRUZt",
                description:
                  "Warning message when attempting to update a published process advertisement",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
              <span data-h2-font-weight="base(700)">{title}</span>
            </p>
          </Well>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleUpdate)}>
              <TextArea
                name="changeJustification"
                id="changeJustification"
                label={label}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                context={intl.formatMessage({
                  defaultMessage:
                    "Please write the justification for this change.",
                  id: "SjISKL",
                  description:
                    "Help text for justifying updating published pool",
                })}
              />
              <Dialog.Footer>
                <Button color="error" type="button" onClick={handleSave}>
                  {intl.formatMessage(formMessages.saveChanges)}
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

export default UpdatePublishedProcessDialog;
