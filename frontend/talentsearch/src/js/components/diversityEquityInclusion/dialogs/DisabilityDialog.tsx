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
  hasDisability: boolean;
}

const DisabilityDialogFooter: React.FC<EquityDialogFooterProps> = ({
  onSave,
  isAdded,
  children,
}) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      hasDisability: isAdded,
    },
  });
  const { handleSubmit } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    onSave(data.hasDisability);
  };

  return (
    <FormProvider {...methods}>
      <AddToProfile />
      <form onSubmit={handleSubmit(submitHandler)}>
        <Checkbox
          id="hasDisability"
          name="hasDisability"
          label={intl.formatMessage({
            defaultMessage: "I identify as a person with a disability.",
            description:
              "Label for the checkbox to identify as a person with a disability under employment equity",
          })}
        />
        {children}
      </form>
    </FormProvider>
  );
};

const DisabilityDialog: React.FC<EquityDialogProps> = ({
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
        defaultMessage: "Persons with disabilities ",
        description:
          "Title for equity dialog to add/remove having a disability category to profile",
      })}
      footer={
        <DisabilityDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogActions onDismiss={onDismiss} />
        </DisabilityDialogFooter>
      }
    >
      <UnderReview />
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Refers to a person whose daily activities are limited as a result of an impairment or difficulty with particular tasks. The only exception to this is for developmental disabilities where a person is considered to be disabled if the respondent has been diagnosed with this condition.",
          description:
            "Definition of accepted ways to identify as person with a disability.",
        })}
      </p>
      <Definition url="https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=247841&CVD=247841&CLV=0&MLV=1&D=1" />
    </Dialog>
  );
};

export default DisabilityDialog;
