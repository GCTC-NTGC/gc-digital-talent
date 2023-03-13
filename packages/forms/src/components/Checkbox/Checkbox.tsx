import React from "react";
import get from "lodash/get";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";

import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import InputWrapper from "../InputWrapper";

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
  boundingBoxLabel?: React.ReactNode;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  /** Determine if it should track unsaved changes and render it */
  isUnsaved?: boolean;
}

const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  id,
  label,
  name,
  rules = {},
  context,
  isUnsaved,
  boundingBox = false,
  boundingBoxLabel = label,
  trackUnsaved = true,
  ...rest
}) => {
  const [isContextVisible, setContextVisible] = React.useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context: context && isContextVisible,
    },
  });

  return (
    <div
      data-h2-position="base(relative)"
      data-h2-margin="base(0, 0, x.125, 0)"
    >
      {!boundingBox ? (
        <InputWrapper
          inputId={id}
          inputName={name}
          label={label}
          labelSize="copy"
          required={!!rules.required}
          context={context}
          error={error}
          trackUnsaved={trackUnsaved}
          onContextToggle={setContextVisible}
          descriptionIds={descriptionIds}
          data-h2-flex-direction="base(row)"
          data-h2-align-items="base(flex-start)"
          data-h2-line-height="base:selectors[>label](1)"
        >
          <input
            data-h2-order="base(-1)"
            data-h2-margin="base(x.2, x.25, 0, 0)"
            id={id}
            {...register(name, rules)}
            type="checkbox"
            aria-invalid={error ? "true" : "false"}
            aria-required={rules.required ? "true" : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...rest}
          />
        </InputWrapper>
      ) : (
        <InputWrapper
          inputId={id}
          inputName={name}
          label={boundingBoxLabel}
          required={!!rules.required}
          context={context}
          error={error}
          trackUnsaved={trackUnsaved}
          onContextToggle={setContextVisible}
          descriptionIds={descriptionIds}
          fillLabel
        >
          <div
            data-h2-background-color="base(white)"
            {...stateStyles}
            data-h2-radius="base(input)"
            data-h2-padding="base(x.25, x.5)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            style={{ width: "100%" }}
          >
            <input
              id={id}
              {...register(name, rules)}
              type="checkbox"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={ariaDescribedBy}
              {...rest}
            />
            <span
              data-h2-margin="base(0, 0, 0, x.25)"
              data-h2-font-size="base(copy)"
            >
              {label}
            </span>
          </div>
        </InputWrapper>
      )}
    </div>
  );
};

export default Checkbox;
