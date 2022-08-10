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
        <div data-h2-margin="base(0, 0, x1, 0)">
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
      color="ts-primary"
      title={intl.formatMessage(getEmploymentEquityGroup("woman"))}
      footer={
        <WomanDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogActions onDismiss={onDismiss} />
        </WomanDialogFooter>
      }
    >
      <UnderReview />
      <p data-h2-margin="base(0, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "This category includes persons whose reported gender is female. It includes cisgender (cis) and transgender (trans) women.",
          description: "Definition of accepted ways to identify as a women",
        })}
      </p>
      <Definition
        url={
          intl.locale === "en"
            ? "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1326727&CVD=1326727&CLV=0&MLV=1&D=1"
            : "https://www23.statcan.gc.ca/imdb/p3VD_f.pl?Function=getVD&TVD=1326727&CVD=1326727&CLV=0&MLV=1&D=1"
        }
      />
    </Dialog>
  );
};

export default WomanDialog;
