import { FocusEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { errorMessages } from "@gc-digital-talent/i18n";

import Field from "../Field";
import { CommonInputProps, HTMLInputProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import { inputStyles } from "../../styles";

const input = tv({
  extend: inputStyles,
  base: "",
  variants: {
    readOnly: {
      true: "bg-gray-100 dark:bg-gray-500",
    },
  },
});

export type InputProps = HTMLInputProps &
  CommonInputProps & {
    /** Set the type of the input. */
    type: "text" | "number" | "email" | "tel" | "password" | "search" | "url";
    // Whether to trim leading/ending whitespace upon blurring of an input, default on
    whitespaceTrim?: boolean;
    maxLength?: number;
  };

const Input = ({
  id,
  context,
  label,
  name,
  rules = {},
  type,
  readOnly,
  "aria-describedby": describedBy,
  whitespaceTrim = true,
  trackUnsaved = true,
  maxLength = 255,
  className,
  ...rest
}: InputProps) => {
  const intl = useIntl();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const isInvalid = fieldState === "invalid";
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error: isInvalid,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const normalizeInput = (e: FocusEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (whitespaceTrim) {
      inputValue = inputValue.trim();
    }
    setValue(name, inputValue);
  };

  return (
    <Field.Wrapper>
      <Field.Label id={`${id}-label`} htmlFor={id} required={!!rules.required}>
        {label}
      </Field.Label>
      <input
        id={id}
        type={type}
        aria-describedby={ariaDescribedBy}
        aria-required={!!rules.required}
        aria-invalid={isInvalid}
        readOnly={readOnly}
        className={input({ state: fieldState, readOnly, class: className })}
        {...register(name, {
          maxLength: {
            message: intl.formatMessage(errorMessages.overCharacterLimit, {
              value: maxLength + 1,
            }),
            value: maxLength,
          },
          ...rules,
          onBlur: normalizeInput,
        })}
        {...rest}
      />
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default Input;
