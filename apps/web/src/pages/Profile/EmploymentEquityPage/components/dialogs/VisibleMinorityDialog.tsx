import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { Dialog } from "@gc-digital-talent/ui";
import { Checkbox } from "@gc-digital-talent/forms";
import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@gc-digital-talent/i18n";

import type { EquityDialogProps } from "../../types";

import AddToProfile from "./AddToProfile";
import Definition from "./Definition";
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

interface FormValues {
  isVisibleMinority: boolean;
}

const VisibleMinorityDialog = ({
  isAdded,
  onSave,
  children,
}: EquityDialogProps) => {
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
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-secondary">
          {intl.formatMessage(getEmploymentEquityGroup("minority"))}
        </Dialog.Header>
        <UnderReview />
        <Definition
          url={
            intl.locale === "en"
              ? "https://www23.statcan.gc.ca/imdb/p3Var.pl?Function=DEC&Id=45152"
              : "https://www23.statcan.gc.ca/imdb/p3Var_f.pl?Function=DEC&Id=45152"
          }
        />
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              'Visible minority refers to whether a person is a visible minority or not, as defined by the Employment Equity Act. The Employment Equity Act defines visible minorities as "persons, other than Aboriginal peoples, who are non-Caucasian in race or non-white in colour". The visible minority population consists mainly of the following groups: South Asian, Chinese, Black, Filipino, Arab, Latin American, Southeast Asian, West Asian, Korean and Japanese.',
            id: "F4K5RB",
            description:
              "Definition of Visible minority from the StatsCan 'Visible minority of person' page.",
          })}
        </p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <AddToProfile />
            <div data-h2-margin="base(x1, 0, x1.5, 0)">
              <Checkbox
                id="isVisibleMinority"
                name="isVisibleMinority"
                label={intl.formatMessage(
                  getEmploymentEquityStatement("minority"),
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

export default VisibleMinorityDialog;
