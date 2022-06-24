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
        <Checkbox
          id="isWoman"
          name="isWoman"
          label={intl.formatMessage({
            defaultMessage: "I identify as a woman.",
            description:
              "Label for the checkbox to identify as a woman under employment equity",
          })}
        />
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
      title={intl.formatMessage({
        defaultMessage: "Women (She/Her)",
        description:
          "Title for equity dialog to add/remove women category to profile",
      })}
      footer={
        <WomanDialogFooter isAdded={isAdded} onSave={onSave}>
          <DialogActions onDismiss={onDismiss} />
        </WomanDialogFooter>
      }
    >
      <UnderReview />
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This category includes persons whose reported gender is female. It includes cisgender (cis) and transgender (trans) women.",
          description: "Definition of accepted ways to identify as a women",
        })}
      </p>
      <Definition url="https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1326727&CVD=1326727&CLV=0&MLV=1&D=1" />
    </Dialog>
  );
};

export default WomanDialog;
