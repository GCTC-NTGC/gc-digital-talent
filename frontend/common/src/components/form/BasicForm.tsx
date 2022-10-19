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
  removeFromSessionStorage,
  setInSessionStorage,
} from "../../helpers/storageUtils";
import { useHistory } from "../../helpers/router";

type BasicFormProps<TFieldValues extends FieldValues> = PropsWithChildren<{
  onSubmit: SubmitHandler<TFieldValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: UseFormProps<TFieldValues, any>; // FieldValues deals in "any"
  cacheKey?: string; // If included, will cache form values in local storage and retrieve from there if possible.
}>;

export function BasicForm<TFieldValues extends FieldValues>({
  onSubmit,
  children,
  options,
  cacheKey,
}: BasicFormProps<TFieldValues>): ReactElement {
  const history = useHistory();
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

  React.useEffect(() => {
    return history.listen(() => {
      if (cacheKey) {
        removeFromSessionStorage(cacheKey);
      }
    });
  }, [cacheKey, history]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export default BasicForm;
