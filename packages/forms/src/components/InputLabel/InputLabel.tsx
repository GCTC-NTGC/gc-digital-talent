import React, { useState } from "react";
import QuestionMarkCircleIcon from "@heroicons/react/24/solid/QuestionMarkCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { useIntl } from "react-intl";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import "./input-label.css";

export interface InputLabelProps {
  inputId: string;
  label: string | React.ReactNode;
  labelSize?: object;
  required: boolean;
  contextIsVisible?: boolean;
  contextToggleHandler?: (contextIsActive: boolean) => void;
  hideOptional?: boolean;
  hideBottomMargin?: boolean;
  fillLabel?: boolean;
}

const InputLabel = ({
  inputId,
  label,
  labelSize,
  fillLabel = false,
  required,
  contextToggleHandler = () => {
    /* returns nothing */
  },
  contextIsVisible = false,
  hideOptional = false,
  hideBottomMargin = false,
}: InputLabelProps): React.ReactElement => {
  const [contextIsActive, setContextIsActive] = useState(false);
  const clickHandler = () => {
    contextToggleHandler(!contextIsActive);
    setContextIsActive((currentState) => !currentState);
  };
  const intl = useIntl();
  const appendLabel = required || !hideOptional || contextIsVisible;

  const labelStyles = {
    "data-h2-margin": "base(0, x.125, 0, 0)",
    "data-h2-flex-grow": appendLabel ? undefined : "base(1)",
    ...labelSize,
  };

  return (
    <div
      data-h2-color="base(inherit)"
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(flex-start)"
      data-h2-width="base(100%)"
      {...(!hideBottomMargin && {
        "data-h2-margin": "base(0, 0, x.125, 0)",
      })}
      {...(!hideBottomMargin && {
        "data-h2-margin": "base(0, 0, x.125, 0)",
      })}
    >
      <label
        className={`InputLabel${fillLabel ? " InputLabel--fill" : ""}`}
        {...labelStyles}
        htmlFor={inputId}
        id={`${inputId}-label`}
      >
        {label}
      </label>
      {appendLabel && (
        <div
          data-h2-position="base(relative)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          style={{ zIndex: 10 }}
        >
          {
            /** If hideOptional is true, only show text if required is true. */
            (required || !hideOptional) && (
              <span
                data-h2-font-size="base(caption)"
                data-h2-display="base(inline-block)"
                data-h2-margin="base(0, 0, 0, x.125)"
                {...(required
                  ? { "data-h2-color": "base(error.dark)" }
                  : { "data-h2-color": "base(gray.darker)" })}
              >
                (
                {required
                  ? intl.formatMessage(commonMessages.required)
                  : intl.formatMessage(commonMessages.optional)}
                )
              </span>
            )
          }
          {contextIsVisible && (
            <button
              type="button"
              className="input-label-context-button"
              data-h2-margin="base(0, 0, 0, x.125)"
              aria-controls={`context-${inputId}`}
              aria-expanded={contextIsActive}
              onClick={clickHandler}
            >
              <span data-h2-visually-hidden="base(invisible)">
                {intl.formatMessage(formMessages.toggleContext)}
              </span>
              {contextIsActive ? (
                <XCircleIcon
                  style={{ width: "calc(1rem/1.25)" }}
                  data-h2-color="base(primary)"
                />
              ) : (
                <QuestionMarkCircleIcon
                  style={{ width: "calc(1rem/1.25)" }}
                  data-h2-color="base(primary)"
                />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InputLabel;
