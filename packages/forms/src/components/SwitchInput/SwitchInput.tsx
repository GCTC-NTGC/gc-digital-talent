import { forwardRef, ElementRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { Switch, SwitchProps } from "@gc-digital-talent/ui";
import { nodeToString } from "@gc-digital-talent/helpers";

import { CommonInputProps } from "../../types";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import Field from "../Field";
import { useRegisterFormLabel } from "../FormLabelsProvider";

export type SwitchInputProps = SwitchProps & {
  id: CommonInputProps["id"];
  name: CommonInputProps["name"];
  label: CommonInputProps["label"];
  rules?: CommonInputProps["rules"];
  hideLabel?: boolean;
};

const SwitchInput = forwardRef<ElementRef<typeof Switch>, SwitchInputProps>(
  (
    { id, name, label, rules, disabled, hideLabel = false, ...rest },
    forwardedRef,
  ) => {
    const {
      control,
      setValue,
      watch,
      formState: { errors, defaultValues },
    } = useFormContext<Record<string, boolean>>();
    useRegisterFormLabel(name, label);
    const value = watch(name);
    const defaultValue = Boolean(defaultValues?.[name]);
    const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
      id,
      show: {
        error: !!errors?.[name],
      },
    });

    const toggle = (newChecked: boolean) => {
      if (!disabled) {
        setValue(name, newChecked);
      }
    };

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={() => (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              {!hideLabel && (
                <Field.Label htmlFor={id} required={!!rules?.required}>
                  {label}
                </Field.Label>
              )}
              <Switch
                ref={forwardedRef}
                id={id}
                defaultChecked={defaultValue}
                onCheckedChange={toggle}
                checked={Boolean(value)}
                {...(hideLabel && {
                  "aria-label": nodeToString(label),
                })}
                {...(disabled && {
                  "aria-disabled": "true",
                  disabled: true,
                })}
                aria-describedby={ariaDescribedBy}
                {...rest}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <Field.Error id={descriptionIds?.error}>{message}</Field.Error>
              )}
            />
          </div>
        )}
      />
    );
  },
);

export default SwitchInput;
