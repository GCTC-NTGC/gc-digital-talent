import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import type { EquityDialogProps, EquityDialogFooterProps } from "../types";

import DialogActions from "./DialogActions";

// Question: Is this the correct URL?
const statsCanLink = (...chunks: string[]) => (
  <a href="https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DECI&Id=1324435">
    {chunks}
  </a>
);

interface FormValues {
  isIndigenous: boolean;
}

const IndigenousDialogFooter: React.FC<EquityDialogFooterProps> = ({
  onSave,
  isAdded,
  children,
}) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      isIndigenous: isAdded,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    onSave(data.isIndigenous);
  };

  return (
    <FormProvider {...methods}>
      <p>
        {intl.formatMessage({
          defaultMessage: '"I have read the provided definition and..."',
          description:
            "Message on employment equity forms confirming user read the provided definition",
        })}
      </p>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Checkbox
          id="isIndigenous"
          name="isIndigenous"
          label={intl.formatMessage({
            defaultMessage: '"I am Indigenous."',
            description:
              "Label for the checkbox to identify as indigenous under employment equity",
          })}
        />
        {children}
      </form>
    </FormProvider>
  );
};

const IndigenousDialog: React.FC<EquityDialogProps> = ({
  isOpen,
  onDismiss,
  isAdded,
  onSave,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ts-primary"
      title={intl.formatMessage({
        defaultMessage: "Indigenous peoples",
        description:
          "Title for equity dialog to add/remove indigenous category to profile",
      })}
      footer={
        <IndigenousDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogActions onDismiss={onDismiss} />
        </IndigenousDialogFooter>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Indigenous identity refers to whether the person identified with the Indigenous peoples of Canada. This includes those who identify as First Nations (North American Indian), Métis and/or Inuk (Inuit), and/or those who report being Registered or Treaty Indians (that is, registered under the Indian Act of Canada), and/or those who have membership in a First Nation or Indian band. Aboriginal peoples of Canada (referred to here as Indigenous peoples) are defined in the Constitution Act, 1982, Section 35 (2) as including the Indian, Inuit and Métis peoples of Canada.",
          description: "Definition of accepted ways to identify as indigenous.",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: " As defined by <link>Statistics Canada</link>.",
            description:
              "Text directing users to the statistics Canada definition of indigenous peoples.",
          },
          {
            link: statsCanLink,
          },
        )}
      </p>
    </Dialog>
  );
};

export default IndigenousDialog;
