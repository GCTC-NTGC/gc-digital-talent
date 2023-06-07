import * as React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import Base from "../Base";
import { CommonInputProps } from "../../types";

import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

export type InputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "capture" | "type"
> &
  CommonInputProps & {
    /** Set the type of the input. */
    type: "text" | "number" | "email" | "tel" | "password" | "date" | "search";
    // Whether to trim leading/ending whitespace upon blurring of an input, default on
    whitespaceTrim?: boolean;
  };

const Input = ({
  id,
  context,
  label,
  name,
  rules = {},
  type,
  readOnly,
  whitespaceTrim = true,
  trackUnsaved = true,
  ...rest
}: InputProps) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const whitespaceTrimmer = (e: React.FocusEvent<HTMLInputElement>) => {
    if (whitespaceTrim) {
      const value = e.target.value.trim();
      setValue(name, value);
    }
  };

  return (
    <Base.Wrapper>
      <Base.Label id={`${id}-label`} htmlFor={id} required={!!rules.required}>
        {label}
      </Base.Label>
      <input
        id={id}
        type={type}
        aria-describedby={ariaDescribedBy}
        required={!!rules.required}
        {...baseStyles}
        {...stateStyles}
        {...register(name, {
          ...rules,
          onBlur: whitespaceTrimmer,
        })}
        {...(readOnly
          ? {
              readOnly: true,
              "data-h2-background-color": "base(background.dark)",
            }
          : {})}
        {...rest}
      />
      {context && (
        <Base.Description id={descriptionIds?.context}>
          {context}
        </Base.Description>
      )}
      {error && (
        <Base.Error id={descriptionIds?.error}>{error?.toString()}</Base.Error>
      )}
    </Base.Wrapper>
  );
};

export default Input;
