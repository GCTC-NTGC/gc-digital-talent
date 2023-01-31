import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import { Checkbox } from "@common/components/form";

import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@common/constants";
import type { EquityDialogProps } from "../../types";

import AddToProfile from "./AddToProfile";
import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

interface FormValues {
  isIndigenous: boolean;
}

const IndigenousDialog = ({ isAdded, onSave, children }: EquityDialogProps) => {
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
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-secondary">
          {intl.formatMessage(getEmploymentEquityGroup("indigenous"))}
        </Dialog.Header>
        <UnderReview />
        <Definition
          url={
            intl.locale === "en"
              ? "https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=42927"
              : "https://www23.statcan.gc.ca/imdb/p3Var_f.pl?Function=DEC&Id=42927"
          }
        />
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Indigenous identity refers to whether the person identified with the Indigenous peoples of Canada. This includes those who identify as First Nations (North American Indian), Métis and/or Inuk (Inuit), and/or those who report being Registered or Treaty Indians (that is, registered under the Indian Act of Canada), and/or those who have membership in a First Nation or Indian band. Aboriginal peoples of Canada (referred to here as Indigenous peoples) are defined in the Constitution Act, 1982, Section 35 (2) as including the Indian, Inuit and Métis peoples of Canada.",
            id: "YDeXEW",
            description:
              "Definition of Indigenous identity from the StatsCan 'Indigenous identity of person' page.",
          })}
        </p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <AddToProfile />
            <div data-h2-margin="base(x1, 0, x1.5, 0)">
              <Checkbox
                id="isIndigenous"
                name="isIndigenous"
                label={intl.formatMessage(
                  getEmploymentEquityStatement("indigenous"),
                )}
              />
            </div>
            <Dialog.Footer>
              <DialogFooter />
            </Dialog.Footer>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default IndigenousDialog;
