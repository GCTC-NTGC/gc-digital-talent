import React, { useState } from "react";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { commonMessages } from "../../../messages";

export interface InputLabelProps {
  inputId: string;
  label: string | React.ReactNode;
  required: boolean;
  contextIsVisible?: boolean;
  contextToggleHandler?: (contextIsActive: boolean) => void;
  hideOptional?: boolean;
}

export const InputLabel: React.FC<InputLabelProps> = ({
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
  const intl = useIntl();
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
              {...(required
                ? { "data-h2-font-color": "b(red)" }
                : { "data-h2-font-color": "b(darkgray)" })}
            >
              {required
                ? intl.formatMessage(commonMessages.required)
                : intl.formatMessage(commonMessages.optional)}
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
          </button>
        )}
      </div>
    </div>
  );
};

export default InputLabel;
