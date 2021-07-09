import React, { useState } from "react";
import InputLabel from "./InputLabel";

export interface InputWrapperProps {
  inputId: string;
  label: string;
  required: boolean;
  error?: string;
  contextToggleIsVisible?: boolean;
  context?: string;
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  inputId,
  label,
  required,
  error,
  contextToggleIsVisible,
  context,
  children,
}) => {
  const [contextVisible, setContextVisible] = useState(false);
  return (
    <div>
      <InputLabel
        inputId={inputId}
        label={label}
        required={required}
        contextIsVisible={contextToggleIsVisible}
        contextToggleHandler={setContextVisible}
      />
      {children}
      {error && <span role="alert">{error}</span>}
      {contextVisible && context && contextToggleIsVisible && (
        <p data-h2-bg-color="b(lightpurple)">{context}</p>
      )}
    </div>
  );
};

export default InputWrapper;
