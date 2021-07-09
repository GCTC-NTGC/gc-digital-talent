import React, { useState } from "react";
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
    <div>
      <div data-h2-flex-grid="b(middle, contained, flush, none)">
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
        <p data-h2-font-size="b(caption)" role="alert">
          {error}
        </p>
      )}
      {contextVisible && context && (
        <p data-h2-font-size="b(caption)" data-h2-bg-color="b(lightpurple)">
          {context}
        </p>
      )}
    </div>
  );
};

export default InputWrapper;
