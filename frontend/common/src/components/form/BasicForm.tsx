import React, { PropsWithChildren, ReactElement } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";

export function BasicForm<
  TFieldValues extends FieldValues,
  // eslint-disable-next-line @typescript-eslint/ban-types
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TContext extends object = object,
>({
  onSubmit,
  children,
  options,
}: PropsWithChildren<{
  onSubmit: SubmitHandler<TFieldValues>;
  options?: UseFormProps<TFieldValues, unknown>;
}>): ReactElement {
  const methods = useForm(options);
  const { handleSubmit } = methods;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export default BasicForm;
