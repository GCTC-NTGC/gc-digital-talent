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
  removeFromSessionStorage,
  setInSessionStorage,
} from "../../helpers/storageUtils";
import ErrorSummary from "./ErrorSummary";
import UnsavedChanges from "./UnsavedChanges";

export type FieldLabels = Record<string, React.ReactNode>;

/**
 * Basic Form Props
 *
 * @typeParam TFieldValues - The form values being registered
 * @param onSubmit - Callback ran when form is submitted
 * @param options<TFieldValues, unknown> - Options forwarded to react-hook-form
 * @param cacheKey - If included, will cache form values in local storage and retrieve from there if possible.
 * @param labels - Used to map field names to human readable labels (errors, unsaved changes)
 */
export type BasicFormProps<TFieldValues extends FieldValues> =
  PropsWithChildren<{
    onSubmit: SubmitHandler<TFieldValues>;
    options?: UseFormProps<TFieldValues, unknown>; // FieldValues deals in "any"
    cacheKey?: string;
    labels?: FieldLabels;
  }>;

export function BasicForm<TFieldValues extends FieldValues>({
  onSubmit,
  children,
  options,
  cacheKey,
  labels,
}: BasicFormProps<TFieldValues>): ReactElement {
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const methods = useForm({
    mode: "onChange",
    shouldFocusError: false,
    ...options,
    defaultValues: options?.defaultValues,
  });
  if (cacheKey) {
    // Whenever form values change, update cache.
    methods.watch((values: unknown) => setInSessionStorage(cacheKey, values));
  }

  const {
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = methods;

  React.useEffect(() => {
    // After during submit, if there are errors, focus the summary
    if (errors && isSubmitting && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [isSubmitting, errors, errorSummaryRef]);

  const handleSubmit = (data: TFieldValues) => {
    // Reset form to clear dirty values
    reset(data, {
      keepDirty: false,
    });
    if (cacheKey) {
      // Clear the cache as well (no longer needed)
      removeFromSessionStorage(cacheKey);
    }
    // Fire the submit we passed in
    onSubmit(data);
  };

  React.useEffect(() => {
    if (cacheKey) {
      const cachedValues = getFromSessionStorage(
        cacheKey,
        options?.defaultValues,
      ) as TFieldValues;

      if (cachedValues) {
        /**
         * Iterates through all cached values touching and dirtying the fields
         * so we can display any errors and unsaved changes
         */
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
                shouldDirty: true, // Need to dirty it for error/unsaved change tracking
                shouldTouch: false,
                shouldValidate: false,
              });
            }
          }
        });
      }
    }
  }, [cacheKey, options, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        {errors && <ErrorSummary ref={errorSummaryRef} labels={labels} />}
        {cacheKey && isDirty && <UnsavedChanges labels={labels} />}
        {children}
      </form>
    </FormProvider>
  );
}

export default BasicForm;
