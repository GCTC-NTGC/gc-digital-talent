import * as React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { InputWrapper } from "../../inputPartials";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Holds text for the label associated with the input element */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
}

const TextArea: React.FunctionComponent<TextAreaProps> = ({
  id,
  context,
  label,
  name,
  rules = {},
  children,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;

  return (
    <div data-h2-margin="b(x1, 0)">
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules.required}
        context={context}
        error={error}
      >
        <textarea
          data-h2-padding="b(x.25, x.5)"
          data-h2-radius="b(input)"
          data-h2-min-height="b(x6)"
          data-h2-border="b(all, 1px, solid, dt-gray)"
          style={{ width: "100%", resize: "vertical" }}
          id={id}
          {...register(name, rules)}
          aria-required={rules.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          {...rest}
        />
        {children}
      </InputWrapper>
    </div>
  );
};

export default TextArea;
