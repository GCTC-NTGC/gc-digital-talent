import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import InputContext from "./InputContext";
import InputError from "./InputError";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** The text for the label associated with the select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: { value: string | number; text: string }[];
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** If an error string is provided, it will appear below the fieldset inputs. */
  error?: string;
}

const Select: React.FunctionComponent<SelectProps> = ({
  id,
  label,
  name,
  options,
  rules,
  context,
  error,
  ...rest
}) => {
  const [contextIsActive, setContextIsActive] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const formError = errors[name]?.message;
  return (
    <div>
      <div data-h2-flex-grid="b(top, contained, flush, s)">
        <div data-h2-flex-item="b(1of2)">
          <label data-h2-font-size="b(caption)" data-h2-bg-color="b(theme-1)">
            {label}
          </label>
        </div>
        <div data-h2-flex-item="b(1of2)">
          <>
            {contextIsActive ? (
              <XCircleIcon
                style={{ width: "calc(1rem/1.25)", float: "right" }}
                data-h2-font-color="b(lightpurple)"
                data-h2-margin="b(left, xxs)"
              />
            ) : (
              <QuestionMarkCircleIcon
                style={{ width: "calc(1rem/1.25)", float: "right" }}
                data-h2-font-color="b(lightpurple)"
                data-h2-margin="b(left, xxs)"
              />
            )}
          </>
          <label
            data-h2-font-size="b(caption)"
            data-h2-bg-color="b(theme-1)"
            data-h2-padding="b(left, xxs)"
            style={{ float: "right" }}
          >
            {rules && rules?.required && (
              <span data-h2-color="b(red)">Required</span>
            )}
            {!rules?.required && <span>Optional</span>}
          </label>
        </div>
      </div>
      <select
        data-h2-radius="b(s)"
        data-h2-padding="b(top-bottom, xxs) b(left, xxs)"
        data-h2-margin="b(bottom, xs)"
        data-h2-font-size="b(normal)"
        id={id}
        style={{ width: "100%" }}
        {...register(name, rules)}
        aria-invalid={error ? "true" : "false"}
        {...rest}
      >
        {options.map(({ value, text }) => (
          <option
            data-h2-font-size="b(caption)"
            data-h2-color="b(white)"
            key={value}
            value={value}
          >
            {text}
          </option>
        ))}
      </select>
      {context && <InputContext isVisible={!!context} context={context} />}
      {error && <InputError isVisible={!!error} error={error} />}
      {formError && <span role="alert">{formError}</span>}
    </div>
  );
};

export default Select;
