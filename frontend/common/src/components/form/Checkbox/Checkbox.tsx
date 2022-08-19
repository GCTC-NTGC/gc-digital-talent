import React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { InputWrapper } from "../../inputPartials";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "capture" | "type"
  > {
  /** HTML id used to identify the element. */
  id: string;
  /** Holds text for the label associated with the input element */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Wrap input in bounding box. */
  boundingBox?: boolean;
  /** Label for the bounding box. */
  boundingBoxLabel?: string;
}

export const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  id,
  label,
  name,
  rules = {},
  context,
  boundingBox = false,
  boundingBoxLabel = label,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;

  return (
    <div data-h2-margin="base(0, 0, x.125, 0)">
      {!boundingBox ? (
        <InputWrapper
          inputId={id}
          label={label}
          labelSize="copy"
          required={!!rules.required}
          context={context}
          error={error}
          data-h2-flex-direction="base(row)"
          data-h2-align-items="base(center)"
        >
          <input
            data-h2-order="base(-1)"
            data-h2-margin="base(0, x.25, 0, 0)"
            id={id}
            {...register(name, rules)}
            type="checkbox"
            aria-invalid={error ? "true" : "false"}
            aria-required={rules.required ? "true" : undefined}
            {...rest}
          />
        </InputWrapper>
      ) : (
        <InputWrapper
          inputId={id}
          label={boundingBoxLabel}
          required={!!rules.required}
          context={context}
          error={error}
        >
          <div
            data-h2-background-color="base(dt-white)"
            data-h2-border="base(all, 1px, solid, dt-gray)"
            data-h2-radius="base(input)"
            data-h2-padding="base(x.25, x.5)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            style={{ width: "100%" }}
          >
            <label htmlFor={id}>
              <input
                id={id}
                {...register(name, rules)}
                type="checkbox"
                aria-invalid={error ? "true" : "false"}
                {...rest}
              />
              <span
                data-h2-margin="base(0, 0, 0, x.25)"
                data-h2-font-size="base(copy)"
              >
                {label}
              </span>
            </label>
          </div>
        </InputWrapper>
      )}
    </div>
  );
};

export default Checkbox;
