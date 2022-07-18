import React, { useState } from "react";
import InputContext from "../InputContext/InputContext";
import InputError from "../InputError/InputError";
import InputLabel from "../InputLabel/InputLabel";

export interface InputWrapperProps {
  inputId: string;
  label: string | React.ReactNode;
  required: boolean;
  error?: string;
  errorPosition?: "top" | "bottom";
  context?: string;
  hideOptional?: boolean;
  addBottomMargin?: boolean;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
  inputId,
  label,
  required,
  error,
  errorPosition = "bottom",
  context,
  hideOptional,
  children,
  addBottomMargin = true,
  ...rest
}) => {
  const [contextVisible, setContextVisible] = useState(false);
  return (
    <>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column)"
        data-h2-align-items="b(flex-start)"
        {...rest}
      >
        <div>
          <InputLabel
            inputId={inputId}
            label={label}
            required={required}
            contextIsVisible={context !== undefined && context !== ""}
            contextToggleHandler={setContextVisible}
            hideOptional={hideOptional}
            addBottomMargin={addBottomMargin}
          />
        </div>
        {error && errorPosition === "top" && (
          <div data-h2-display="block" data-h2-margin="b(bottom, xxs)">
            <InputError isVisible={!!error} error={error} />
          </div>
        )}
        {children}
      </div>
      {error && errorPosition === "bottom" && (
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputError isVisible={!!error} error={error} />
        </div>
      )}
      {contextVisible && context && (
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputContext
            isVisible={contextVisible && !!context}
            context={context}
          />
        </div>
      )}
    </>
  );
};

export default InputWrapper;
