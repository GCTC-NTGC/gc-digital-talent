import * as React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import Base from "../Base";

import { CommonInputProps, HTMLInputProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

export type InputProps = HTMLInputProps &
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
  "aria-describedby": describedBy,
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
    describedBy,
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
      <Base.Descriptions ids={descriptionIds} error={error} context={context} />
    </Base.Wrapper>
  );
};

export default Input;
