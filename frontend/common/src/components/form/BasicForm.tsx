import React, { PropsWithChildren, ReactElement } from "react";
import {
  FieldValues,
  FormProvider,
  Path,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";
import {
  getFromSessionStorage,
  setInSessionStorage,
} from "../../helpers/storageUtils";
import UnsavedChanges from "./UnsavedChanges";

export type FieldLabels = Record<string, React.ReactNode>;

export type BasicFormProps<TFieldValues extends FieldValues> =
  PropsWithChildren<{
    onSubmit: SubmitHandler<TFieldValues>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: UseFormProps<TFieldValues, any>; // FieldValues deals in "any"
    cacheKey?: string; // If included, will cache form values in local storage and retrieve from there if possible.
    labels?: FieldLabels;
  }>;

export function BasicForm<TFieldValues extends FieldValues>({
  onSubmit,
  children,
  options,
  cacheKey,
  labels,
}: BasicFormProps<TFieldValues>): ReactElement {
  const methods = useForm({
    mode: "onChange",
    ...options,
    defaultValues: options?.defaultValues,
  });
  if (cacheKey) {
    // Whenever form values change, update cache.
    methods.watch((values: unknown) => setInSessionStorage(cacheKey, values));
  }

  React.useEffect(() => {
    if (cacheKey) {
      const cachedValues = getFromSessionStorage(
        cacheKey,
        options?.defaultValues,
      ) as TFieldValues;

      if (cachedValues) {
        Object.keys(cachedValues).forEach((field) => {
          // Hack: Type our field name
          const typedFieldName = field as Path<TFieldValues>;
          const value = cachedValues[field];
          const defaultValue = options?.defaultValues
            ? options?.defaultValues[field]
            : null;
          if (value) {
            if (!defaultValue || value !== defaultValue) {
              methods.setValue(typedFieldName, value, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }
          }
        });
      }
    }
  }, [cacheKey, options, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {cacheKey && <UnsavedChanges labels={labels} />}
        {children}
      </form>
    </FormProvider>
  );
}

export default BasicForm;
