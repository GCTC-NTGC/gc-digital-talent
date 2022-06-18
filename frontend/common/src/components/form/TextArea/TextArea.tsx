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
  // Whether to trim leading/ending whitespace upon blurring of an input, default on
  whitespaceTrim?: boolean;
}

const TextArea: React.FunctionComponent<TextAreaProps> = ({
  id,
  context,
  label,
  name,
  rules = {},
  children,
  whitespaceTrim = true,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;

  const whitespaceTrimmer = () => {
    if (whitespaceTrim) {
      const ele = document.getElementById(`${id}`) as HTMLInputElement;
      ele.value = ele.value.trim();
      setValue(name, ele.value);
    }
  };

  return (
    <div data-h2-margin="b(bottom, xxs)">
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules.required}
        context={context}
        error={error}
      >
        <textarea
          data-h2-padding="b(all, xxs)"
          data-h2-radius="b(s)"
          data-h2-border="b(darkgray, all, solid, s)"
          data-h2-font-size="b(normal)"
          data-h2-font-family="b(sans)"
          style={{ width: "100%", resize: "vertical" }}
          id={id}
          {...register(name, rules)}
          onBlur={whitespaceTrimmer}
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
