import React, { PropsWithChildren, ReactElement } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

function Form<TFieldValues extends FieldValues>({
  onSubmit,
  children,
}: PropsWithChildren<{ onSubmit: SubmitHandler<TFieldValues> }>): ReactElement {
  const methods = useForm();
  const { handleSubmit } = methods;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export default Form;
