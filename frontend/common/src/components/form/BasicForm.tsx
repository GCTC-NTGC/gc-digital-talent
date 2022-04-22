import React, { PropsWithChildren, ReactElement } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";
import {
  getFromSessionStorage,
  removeFromLocalStorage,
  removeFromSessionStorage,
  setInSessionStorage,
} from "../../helpers/storageUtils";

type BasicFormProps<TFieldValues extends FieldValues> = PropsWithChildren<{
  onSubmit: SubmitHandler<TFieldValues>;
  options?: UseFormProps<TFieldValues, any>;
  cacheKey?: string; // If included, will cache form values in local storage and retrieve from there if possible.
}>;

export function BasicForm<TFieldValues extends FieldValues>({
  onSubmit,
  children,
  options,
  cacheKey,
}: BasicFormProps<TFieldValues>): ReactElement {
  const cacheValues = cacheKey
    ? getFromSessionStorage(cacheKey, options?.defaultValues)
    : options?.defaultValues;

  const methods = useForm({
    ...options,
    defaultValues: cacheValues,
  });
  const { handleSubmit, watch } = methods;
  if (cacheKey) {
    // Whenever form values change, update cache.
    watch((values: unknown) => setInSessionStorage(cacheKey, values));
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export default BasicForm;
