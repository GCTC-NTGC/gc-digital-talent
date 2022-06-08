import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import type { EquityDialogProps, EquityDialogFooterProps } from "../types";

import DialogActions from "./DialogActions";

// Question: Is this the correct URL?
const statsCanLink = (...chunks: string[]) => (
  <a href="https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=410445">
    {chunks}
  </a>
);

interface FormValues {
  isWoman: boolean;
}

const WomanDialogFooter: React.FC<EquityDialogFooterProps> = ({
  onSave,
  isAdded,
  children,
}) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      isWoman: isAdded,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    onSave(data.isWoman);
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
          id="isWoman"
          name="isWoman"
          label={intl.formatMessage({
            defaultMessage: '"I identify as a woman."',
            description:
              "Label for the checkbox to identify as a woman under employment equity",
          })}
        />
        {children}
      </form>
    </FormProvider>
  );
};

const WomanDialog: React.FC<EquityDialogProps> = ({
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
        defaultMessage: "Women (She/Her)",
        description:
          "Title for equity dialog to add/remove women category to profile",
      })}
      footer={
        <WomanDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogActions onDismiss={onDismiss} />
        </WomanDialogFooter>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Persons whose reported gender is female whether in whole or in part. It includes cisgender (cis) and transgender (trans) women.",
          description: "Definition of accepted ways to identify as a women",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: " As defined by <link>Statistics Canada</link>.",
            description:
              "Text directing users to the statistics Canada definition of gender.",
          },
          {
            link: statsCanLink,
          },
        )}
      </p>
    </Dialog>
  );
};

export default WomanDialog;
