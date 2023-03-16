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
  isWoman: boolean;
}

const WomanDialog = ({ isAdded, onSave, children }: EquityDialogProps) => {
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
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(getEmploymentEquityGroup("woman"))}
        </Dialog.Header>
        <Dialog.Body>
          <UnderReview />
          <div data-h2-margin="base(x1, 0)">
            <Definition
              url={
                intl.locale === "en"
                  ? "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1326727&CVD=1326727&CLV=0&MLV=1&D=1"
                  : "https://www23.statcan.gc.ca/imdb/p3VD_f.pl?Function=getVD&TVD=1326727&CVD=1326727&CLV=0&MLV=1&D=1"
              }
            />
          </div>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This category includes persons whose reported gender is female. It includes cisgender (cis) and transgender (trans) women.",
              id: "6danS7",
              description:
                "Definition of the Woman category from the StatsCan 'Classification of gender' page.",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <AddToProfile />
              <div data-h2-margin="base(x1, 0, x1.5, 0)">
                <Checkbox
                  id="isWoman"
                  name="isWoman"
                  label={intl.formatMessage(
                    getEmploymentEquityStatement("woman"),
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

export default WomanDialog;
