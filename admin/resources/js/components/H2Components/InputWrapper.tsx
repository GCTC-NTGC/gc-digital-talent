import React, { useState } from "react";
import InputContext from "./InputContext";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

export interface InputWrapperProps {
  inputId: string;
  label: string;
  required: boolean;
  error?: string;
  context?: string;
  hideOptional?: boolean;
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  inputId,
  label,
  required,
  error,
  context,
  hideOptional,
  children,
}) => {
  const [contextVisible, setContextVisible] = useState(false);
  return (
    <>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-wrap="b(wrap)"
        data-h2-align-items="b(center)"
      >
        <div style={{ flexGrow: 1 }}>
          <InputLabel
            inputId={inputId}
            label={label}
            required={required}
            contextIsVisible={context !== undefined && context !== ""}
            contextToggleHandler={setContextVisible}
            hideOptional={hideOptional}
          />
        </div>
        {children}
      </div>
      {error && (
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
