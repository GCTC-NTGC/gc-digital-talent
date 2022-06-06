import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import type { EquityDialogProps, EquityDialogFooterProps } from "../types";

import DialogActions from "./DialogActions";

// Question: Is this the correct URL?
const acaLink = (...chunks: string[]) => (
  <a href="https://www.canada.ca/en/employment-social-development/programs/accessible-people-disabilities/act-summary.html#h2.02">
    {chunks}
  </a>
);

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
      <p>
        {intl.formatMessage({
          defaultMessage: '"I have read the provided definition and..."',
          description:
            "Message on employment equity forms confirming user read the provided definition",
        })}
      </p>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Checkbox
          id="hasDisability"
          name="hasDisability"
          label={intl.formatMessage({
            defaultMessage: '"I identify as a person with a disability."',
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
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Persons with any impairment, including a physical, mental, intellectual, cognitive, learning, communication or sensory impairment — or a functional limitation — whether permanent, temporary or episodic in nature, or evident or not, that, in interaction with a barrier, hinders a person’s full and equal participation in society.",
          description:
            "Definition of accepted ways to identify as person with a disability.",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "As defined by <link>Accessible Canada Act</link>.",
            description:
              "Text directing users to the Accessible Canada Act definition of person with a disability.",
          },
          {
            link: acaLink,
          },
        )}
      </p>
    </Dialog>
  );
};

export default DisabilityDialog;
