import React, { useState } from "react";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/solid";

export interface InputLabelProps {
  inputId: string;
  label: string;
  required: boolean;
  contextIsVisible?: boolean;
  contextToggleHandler?: (contextIsActive: boolean) => void;
  hideOptional?: boolean;
}

const InputLabel: React.FC<InputLabelProps> = ({
  inputId,
  label,
  required,
  contextToggleHandler = () => {
    /* returns nothing */
  },
  contextIsVisible = false,
  hideOptional = false,
}): React.ReactElement => {
  const [contextIsActive, setContextIsActive] = useState(false);
  const clickHandler = () => {
    contextToggleHandler(!contextIsActive);
    setContextIsActive((currentState) => !currentState);
  };
  return (
    <div
      data-h2-display="b(flex)"
      data-h2-flex-wrap="b(wrap)"
      data-h2-margin="b(bottom, xxs)"
    >
      <div style={{ flex: "1" }}>
        <label data-h2-font-size="b(caption)" htmlFor={inputId}>
          {label}
        </label>
      </div>
      <div>
        {
          /** If hideOptional is true, only show text if required is true. */
          (required || !hideOptional) && (
            <span
              data-h2-font-size="b(caption)"
              data-h2-font-color={required ? "b(red)" : "b(darkgray)"}
            >
              {required ? "Required" : "Optional"}
            </span>
          )
        }
        {contextIsVisible && (
          <button
            type="button"
            className="input-label-context-button"
            data-h2-margin="b(left, xxs)"
            title="Toggle Context"
            onClick={clickHandler}
          >
            <>
              {contextIsActive ? (
                <XCircleIcon
                  style={{ width: "calc(1rem/1.25)" }}
                  data-h2-font-color="b(lightpurple)"
                />
              ) : (
                <QuestionMarkCircleIcon
                  style={{ width: "calc(1rem/1.25)" }}
                  data-h2-font-color="b(lightpurple)"
                />
              )}
            </>
          </button>
        )}
      </div>
    </div>
  );
};

export default InputLabel;
