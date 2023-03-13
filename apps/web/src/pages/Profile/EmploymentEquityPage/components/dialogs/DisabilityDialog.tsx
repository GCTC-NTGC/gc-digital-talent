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
  hasDisability: boolean;
}

const DisabilityDialog = ({ isAdded, onSave, children }: EquityDialogProps) => {
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
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(getEmploymentEquityGroup("disability"))}
        </Dialog.Header>
        <Dialog.Body>
          <UnderReview />
          <Definition
            url={
              intl.locale === "en"
                ? "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=247841&CVD=247841&CLV=0&MLV=1&D=1"
                : "https://www23.statcan.gc.ca/imdb/p3VD_f.pl?Function=getVD&TVD=247841&CVD=247841&CLV=0&MLV=1&D=1"
            }
          />
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Refers to a person whose daily activities are limited as a result of an impairment or difficulty with particular tasks. The only exception to this is for developmental disabilities where a person is considered to be disabled if the respondent has been diagnosed with this condition.",
              id: "y5Z2Li",
              description:
                "Definition of Person with a disability from the StatsCan 'Classification of Status of Disability' page.",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <AddToProfile />
              <div data-h2-margin="base(x1, 0, x1.5, 0)">
                <Checkbox
                  id="hasDisability"
                  name="hasDisability"
                  label={intl.formatMessage(
                    getEmploymentEquityStatement("disability"),
                  )}
                />
              </div>
              <Dialog.Footer>
                <DialogFooter />
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DisabilityDialog;
