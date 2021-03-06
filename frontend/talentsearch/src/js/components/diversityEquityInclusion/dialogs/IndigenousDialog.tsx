import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@common/constants";
import type { EquityDialogProps, EquityDialogFooterProps } from "../types";

import AddToProfile from "./AddToProfile";
import Definition from "./Definition";
import DialogActions from "./DialogActions";
import UnderReview from "./UnderReview";

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
      <AddToProfile />
      <form onSubmit={handleSubmit(submitHandler)}>
        <Checkbox
          id="isIndigenous"
          name="isIndigenous"
          label={intl.formatMessage(getEmploymentEquityStatement("indigenous"))}
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
      title={intl.formatMessage(getEmploymentEquityGroup("indigenous"))}
      footer={
        <IndigenousDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogActions onDismiss={onDismiss} />
        </IndigenousDialogFooter>
      }
    >
      <UnderReview />
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Indigenous identity refers to whether the person identified with the Indigenous peoples of Canada. This includes those who identify as First Nations (North American Indian), M??tis and/or Inuk (Inuit), and/or those who report being Registered or Treaty Indians (that is, registered under the Indian Act of Canada), and/or those who have membership in a First Nation or Indian band. Aboriginal peoples of Canada (referred to here as Indigenous peoples) are defined in the Constitution Act, 1982, Section 35 (2) as including the Indian, Inuit and M??tis peoples of Canada.",
          description: "Definition of accepted ways to identify as indigenous.",
        })}
      </p>
      <Definition
        url={
          intl.locale === "en"
            ? "https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=42927"
            : "https://www23.statcan.gc.ca/imdb/p3Var_f.pl?Function=DEC&Id=42927"
        }
      />
    </Dialog>
  );
};

export default IndigenousDialog;
