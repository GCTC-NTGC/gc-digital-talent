import React, { useState } from "react";

import useFieldState from "../../hooks/useFieldState";
import { DescriptionIds } from "../../hooks/useInputDescribedBy";
import InputContext from "../InputContext";
import InputError, { InputFieldError } from "../InputError";
import InputLabel from "../InputLabel";
import InputUnsaved from "../InputUnsaved";

import "./input-wrapper.css";

export interface InputWrapperProps {
  inputId: string;
  inputName?: string;
  label: string | React.ReactNode;
  labelSize?: string;
  required: boolean;
  error?: InputFieldError;
  errorPosition?: "top" | "bottom";
  context?: string;
  hideOptional?: boolean;
  children?: React.ReactNode;
  hideBottomMargin?: boolean;
  fillLabel?: boolean;
  trackUnsaved?: boolean;
  descriptionIds?: DescriptionIds;
  onContextToggle?: (visible: boolean) => void;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
  inputId,
  inputName,
  label,
  labelSize,
  required,
  error,
  errorPosition = "bottom",
  context,
  hideOptional,
  children,
  hideBottomMargin,
  onContextToggle,
  descriptionIds,
  fillLabel = false,
  trackUnsaved = true,
  ...rest
}) => {
  const [contextVisible, setContextVisible] = useState(false);
  const fieldState = useFieldState(inputName || "", !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;

  let fontSize = { "data-h2-font-size": "base(caption)" };
  if (labelSize === "copy") {
    fontSize = { "data-h2-font-size": "base(copy)" };
  }

  const handleContextToggle = (newContext: boolean) => {
    setContextVisible(newContext);
    if (onContextToggle) {
      onContextToggle(newContext);
    }
  };

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
          fillLabel={fillLabel}
          required={required}
          contextIsVisible={context !== undefined && context !== ""}
          contextToggleHandler={handleContextToggle}
          hideOptional={hideOptional}
          hideBottomMargin={hideBottomMargin}
        />
        {error && errorPosition === "top" && (
          <div
            data-h2-display="base(block)"
            data-h2-margin="base(0, 0, x.125, 0)"
          >
            <InputError
              id={descriptionIds?.error}
              isVisible={!!error}
              error={error}
            />
          </div>
        )}
        {children}
      </div>
      <InputUnsaved isVisible={isUnsaved} id={descriptionIds?.unsaved} />
      {error && errorPosition === "bottom" && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
        >
          <InputError
            id={descriptionIds?.error}
            isVisible={!!error}
            error={error}
          />
        </div>
      )}
      {contextVisible && context && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
          id={descriptionIds?.context}
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
