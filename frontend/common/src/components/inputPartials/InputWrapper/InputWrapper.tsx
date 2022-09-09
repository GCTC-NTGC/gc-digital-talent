import React, { useState } from "react";
import InputContext from "../InputContext/InputContext";
import InputError from "../InputError/InputError";
import InputLabel from "../InputLabel/InputLabel";

export interface InputWrapperProps {
  inputId: string;
  label: string | React.ReactNode;
  labelSize?: string;
  required: boolean;
  error?: string;
  errorPosition?: "top" | "bottom";
  context?: string;
  hideOptional?: boolean;
  hideBottomMargin?: boolean;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
  inputId,
  label,
  labelSize,
  required,
  error,
  errorPosition = "bottom",
  context,
  hideOptional,
  children,
  hideBottomMargin,
  ...rest
}) => {
  const [contextVisible, setContextVisible] = useState(false);
  let fontSize = { "data-h2-font-size": "base(caption)" };
  if (labelSize === "copy") {
    fontSize = { "data-h2-font-size": "base(copy)" };
  }
  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-align-items="base(flex-start)"
        {...rest}
      >
        <InputLabel
          inputId={inputId}
          label={label}
          labelSize={fontSize}
          required={required}
          contextIsVisible={context !== undefined && context !== ""}
          contextToggleHandler={setContextVisible}
          hideOptional={hideOptional}
          hideBottomMargin={hideBottomMargin}
        />
        {error && errorPosition === "top" && (
          <div
            data-h2-display="base(block)"
            data-h2-margin="base(0, 0, x.125, 0)"
          >
            <InputError isVisible={!!error} error={error} />
          </div>
        )}
        {children}
      </div>
      {error && errorPosition === "bottom" && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
        >
          <InputError isVisible={!!error} error={error} />
        </div>
      )}
      {contextVisible && context && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
        >
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
