import { forwardRef, ElementRef } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";

import { Switch, SwitchProps } from "@gc-digital-talent/ui";

import { CommonInputProps } from "../../types";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import Field from "../Field";

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
    } = useFormContext();
    const error = errors[name]?.message as FieldError;
    const value = watch(name);
    const defaultValue = Boolean(defaultValues?.[name]);
    const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
      id,
      show: {
        error,
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
          <div
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            data-h2-gap="base(x.5)"
            data-h2-flex-wrap="base(wrap)"
          >
            <div
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(x.5)"
            >
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
                  "aria-label": label?.toString(),
                })}
                {...(disabled && {
                  "aria-disabled": "true",
                  disabled: true,
                })}
                aria-describedby={ariaDescribedBy}
                {...rest}
              />
            </div>
            {error && (
              <Field.Error id={descriptionIds?.error}>
                {error?.toString()}
              </Field.Error>
            )}
          </div>
        )}
      />
    );
  },
);

export default SwitchInput;
