import { ReactNode } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { UpdateTalentNominationInput } from "@gc-digital-talent/graphql";

import { BaseFormValues } from "../types";
import useMutations from "../useMutations";
import useCurrentStep from "../useCurrentStep";
import Actions from "./Actions";

export type SubmitDataTransformer<TFormValues> = (
  values: TFormValues,
) => UpdateTalentNominationInput;

interface UpdateFormProps<TFormValues extends BaseFormValues> {
  defaultValues?: DefaultValues<TFormValues>;
  submitDataTransformer: SubmitDataTransformer<TFormValues>;
  children: ReactNode;
}

const UpdateForm = <TFormValues extends BaseFormValues>({
  defaultValues,
  submitDataTransformer,
  children,
}: UpdateFormProps<TFormValues>) => {
  const [fetching, { update }] = useMutations();
  const { current } = useCurrentStep();
  const methods = useForm<TFormValues>({
    defaultValues,
    disabled: fetching,
  });

  const handleSubmit = async (values: TFormValues) => {
    await update(
      {
        insertSubmittedStep: current,
        ...submitDataTransformer(values),
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
