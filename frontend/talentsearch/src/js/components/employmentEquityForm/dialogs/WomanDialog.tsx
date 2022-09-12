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
import DialogFooter from "./DialogFooter";
import UnderReview from "./UnderReview";

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
      <AddToProfile />
      <form onSubmit={handleSubmit(submitHandler)}>
        <div data-h2-margin="base(x1, 0, x1.5, 0)">
          <Checkbox
            id="isWoman"
            name="isWoman"
            label={intl.formatMessage(getEmploymentEquityStatement("woman"))}
          />
        </div>
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
      color="ts-secondary"
      title={intl.formatMessage(getEmploymentEquityGroup("woman"))}
    >
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
          id: "E1WElo",
          description: "Definition of accepted ways to identify as a women",
        })}
      </p>
      <Dialog.Footer>
        <WomanDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogFooter onDismiss={onDismiss} />
        </WomanDialogFooter>
      </Dialog.Footer>
    </Dialog>
  );
};

export default WomanDialog;
