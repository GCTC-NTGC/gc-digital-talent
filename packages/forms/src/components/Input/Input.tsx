import { FocusEvent } from "react";
import get from "lodash/get";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { errorMessages } from "@gc-digital-talent/i18n";

import Field from "../Field";
import { CommonInputProps, HTMLInputProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useInputStyles from "../../hooks/useInputStyles";
import { sanitizeString } from "../../utils";

export type InputProps = HTMLInputProps &
  CommonInputProps & {
    /** Set the type of the input. */
    type: "text" | "number" | "email" | "tel" | "password" | "search";
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
  ...rest
}: InputProps) => {
  const intl = useIntl();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message?.toString();
  const baseStyles = useInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const normalizeInput = (e: FocusEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (whitespaceTrim) {
      inputValue = inputValue.trim();
    }
    inputValue = sanitizeString(inputValue);
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
        aria-invalid={!!error}
        {...baseStyles}
        {...stateStyles}
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
        {...(readOnly
          ? {
              readOnly: true,
              "data-h2-background-color": "base(background.dark)",
            }
          : {})}
        {...rest}
      />
      <Field.Descriptions
        ids={descriptionIds}
        error={error}
        context={context}
      />
    </Field.Wrapper>
  );
};

export default Input;
