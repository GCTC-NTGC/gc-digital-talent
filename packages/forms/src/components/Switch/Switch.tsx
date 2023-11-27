import React from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { IconType } from "@gc-digital-talent/ui";

import { CommonInputProps } from "../../types";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import getStyles, { SwitchColor } from "./styles";
import Field from "../Field";

export type SwitchProps = {
  id: CommonInputProps["id"];
  name: CommonInputProps["name"];
  label: CommonInputProps["label"];
  rules?: CommonInputProps["rules"];
  icon?: {
    default: IconType;
    checked?: IconType;
  };
  hideLabel?: boolean;
  color?: SwitchColor;
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    { id, name, label, rules, icon, hideLabel = false, color = "success" },
    forwardedRef,
  ) => {
    const {
      control,
      setValue,
      formState: { errors, defaultValues },
    } = useFormContext();
    const error = errors[name]?.message as FieldError;
    const defaultValue = Boolean(defaultValues && defaultValues[name]);
    const [checked, setChecked] = React.useState<boolean>(defaultValue);
    const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
      id,
      show: {
        error,
      },
    });
    const styles = getStyles(color);
    let Icon: IconType;
    if (icon) {
      Icon = checked && icon.checked ? icon.checked : icon.default;
    }

    const toggle = (newChecked: boolean) => {
      setValue(name, newChecked);
      setChecked(newChecked);
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
              <SwitchPrimitive.Root
                {...styles}
                ref={forwardedRef}
                id={id}
                checked={checked}
                onCheckedChange={toggle}
                {...(hideLabel && {
                  "aria-label": label?.toString(),
                })}
                aria-describedby={ariaDescribedBy}
                data-h2-transition="base(background-color, 100ms, ease-in-out)"
                data-h2-outline="base(none)"
                data-h2-padding="base(x.1)"
                data-h2-position="base(relative)"
                data-h2-radius="base(9999px)"
                data-h2-width="base(x2.2)"
              >
                <SwitchPrimitive.Thumb
                  data-h2-background-color="base(white)"
                  data-h2-color="base:selectors[>svg](black)"
                  data-h2-display="base(block)"
                  data-h2-height="base(x1)"
                  data-h2-width="base(x1)"
                  data-h2-radius="base(9999px)"
                  data-h2-shadow="base(s)"
                  data-h2-transition="base(transform 100ms ease-in-out)"
                  data-h2-transform="
                  base(translateX(0))
                  base:selectors[[data-state='checked']](translateX(x1))"
                >
                  {Icon && <Icon />}
                </SwitchPrimitive.Thumb>
              </SwitchPrimitive.Root>
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

export default Switch;
