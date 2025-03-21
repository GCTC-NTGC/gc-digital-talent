import { ReactNode } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { UpdateTalentNominationInput } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import { BaseFormValues } from "../types";
import useMutations from "../useMutations";
import useCurrentStep from "../useCurrentStep";
import Actions from "./Actions";

export type SubmitDataTransformer<TFormValues> = (
  values: TFormValues,
) => UpdateTalentNominationInput;

interface UpdateFormProps<TFormValues extends BaseFormValues> {
  defaultValues?: DefaultValues<TFormValues>;
  submitDataTransformer?: SubmitDataTransformer<TFormValues>;
  children: ReactNode;
  // Some pre-submit validation to be ran
  // Returns string of error message or null if it is okay
  preSubmitValidation?: (values: TFormValues) => string | null;
}

const UpdateForm = <TFormValues extends BaseFormValues>({
  defaultValues,
  submitDataTransformer,
  preSubmitValidation,
  children,
}: UpdateFormProps<TFormValues>) => {
  const [fetching, { update }] = useMutations();
  const { current } = useCurrentStep();
  const methods = useForm<TFormValues>({
    defaultValues,
    disabled: fetching,
  });

  const handleSubmit = async (values: TFormValues) => {
    const preSubmitValidationError = preSubmitValidation?.(values);
    if (preSubmitValidationError) {
      toast.error(preSubmitValidationError);
      return;
    }

    await update(
      {
        insertSubmittedStep: current,
        ...(submitDataTransformer ? submitDataTransformer(values) : {}),
      },
      values.intent,
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        {children}
        <Actions />
      </form>
    </FormProvider>
  );
};

export default UpdateForm;
