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
    <div data-h2-margin="b(0, 0, x.125, 0)">
      {!boundingBox ? (
        <InputWrapper
          inputId={id}
          label={label}
          required={!!rules.required}
          context={context}
          error={error}
          data-h2-flex-direction="b(row)"
          data-h2-align-items="b(center)"
        >
          <input
            style={{ order: -1 }}
            data-h2-margin="b(0, x.125, x.125, 0)"
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
            data-h2-border="b(all, 1px, solid, dark.dt-gray)"
            data-h2-radius="b(s)"
            data-h2-padding="b(x.125, x.5)"
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
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
                data-h2-margin="b(0, 0, 0, x.25)"
                data-h2-font-size="b(caption)"
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
