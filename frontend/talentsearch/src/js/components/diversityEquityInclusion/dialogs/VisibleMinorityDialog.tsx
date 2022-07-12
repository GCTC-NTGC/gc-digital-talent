import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import type { EquityDialogProps, EquityDialogFooterProps } from "../types";

import AddToProfile from "./AddToProfile";
import Definition from "./Definition";
import DialogActions from "./DialogActions";
import UnderReview from "./UnderReview";

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
      <AddToProfile />
      <form onSubmit={handleSubmit(submitHandler)}>
        <Checkbox
          id="isVisibleMinority"
          name="isVisibleMinority"
          label={intl.formatMessage({
            defaultMessage:
              "I identify as part of one or more visible minority groups.",
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
      <UnderReview />
      <p>
        {intl.formatMessage({
          defaultMessage:
            'Visible minority refers to whether a person is a visible minority or not, as defined by the Employment Equity Act. The Employment Equity Act defines visible minorities as "persons, other than Aboriginal peoples, who are non-Caucasian in race or non-white in colour". The visible minority population consists mainly of the following groups: South Asian, Chinese, Black, Filipino, Arab, Latin American, Southeast Asian, West Asian, Korean and Japanese.',
          description:
            "Definition of accepted ways to identify as a visible minority",
        })}
      </p>
      <Definition
        url={
          intl.locale === "en"
            ? "https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=45152"
            : "https://www23.statcan.gc.ca/imdb/p3Var_f.pl?Function=DEC&Id=45152"
        }
      />
    </Dialog>
  );
};

export default VisibleMinorityDialog;
