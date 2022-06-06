import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import type { EquityDialogProps, EquityDialogFooterProps } from "../types";

import DialogActions from "./DialogActions";

// Question: Is this the correct URL?
const statsCanLink = (...chunks: string[]) => (
  <a href="https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=45152">
    {chunks}
  </a>
);

interface FormValues {
  isVisibleMinority: boolean;
}

const VisibleMinorityDialogFooter: React.FC<EquityDialogFooterProps> = ({
  onSave,
  isAdded,
  children,
}) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      isVisibleMinority: isAdded,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    onSave(data.isVisibleMinority);
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
          id="isVisibleMinority"
          name="isVisibleMinority"
          label={intl.formatMessage({
            defaultMessage:
              '"I identify as part of one or more visible minority groups."',
            description:
              "Label for the checkbox to identify as a visible minority under employment equity",
          })}
        />
        {children}
      </form>
    </FormProvider>
  );
};

const VisibleMinorityDialog: React.FC<EquityDialogProps> = ({
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
        defaultMessage: "Members of visible minorities",
        description:
          "Title for equity dialog to add/remove visible minority category to profile",
      })}
      footer={
        <VisibleMinorityDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogActions onDismiss={onDismiss} />
        </VisibleMinorityDialogFooter>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Visible minority persons, other than Indigenous persons, who are non-Caucasian in race or non-white in colour. Examples of visible minority groups are: South Asian, Chinese, Black, Filipino, Arab, Latin American, Southeast Asian, West Asian, Korean and Japanese.",
          description:
            "Definition of accepted ways to identify as a visible minority",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: " As defined by <link>Statistics Canada</link>.",
            description:
              "Text directing users to the statistics Canada definition of visible minorities.",
          },
          {
            link: statsCanLink,
          },
        )}
      </p>
    </Dialog>
  );
};

export default VisibleMinorityDialog;
