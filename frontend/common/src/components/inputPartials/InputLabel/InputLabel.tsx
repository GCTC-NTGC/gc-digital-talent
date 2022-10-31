import React, { useState } from "react";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useIntl } from "react-intl";
import { commonMessages } from "../../../messages";
import { useFieldState } from "../../../helpers/formUtils";

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
  trackUnsaved?: boolean;
}

const InputLabel: React.FC<InputLabelProps> = ({
  inputId,
  label,
  labelSize,
  fillLabel = false,
  trackUnsaved = true,
  required,
  contextToggleHandler = () => {
    /* returns nothing */
  },
  contextIsVisible = false,
  hideOptional = false,
  hideBottomMargin = false,
}): React.ReactElement => {
  const [contextIsActive, setContextIsActive] = useState(false);
  const clickHandler = () => {
    contextToggleHandler(!contextIsActive);
    setContextIsActive((currentState) => !currentState);
  };
  const intl = useIntl();
  const fieldState = useFieldState(inputId, !trackUnsaved);
  const appendLabel =
    required || !hideOptional || contextIsVisible || fieldState !== "unset";

  const labelStyles = {
    "data-h2-margin": "base(0, x.125, 0, 0)",
    "data-h2-flex-grow": appendLabel ? undefined : "base(1)",
    ...labelSize,
  };

  return (
    <div
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
                  ? { "data-h2-color": "base(dark.dt-error)" }
                  : { "data-h2-color": "base(dark.dt-gray)" })}
              >
                (
                {required
                  ? intl.formatMessage(commonMessages.required)
                  : intl.formatMessage(commonMessages.optional)}
                )
              </span>
            )
          }
          {fieldState === "dirty" && trackUnsaved && (
            <span
              data-h2-font-size="base(caption)"
              data-h2-display="base(inline-block)"
              data-h2-margin="base(0, 0, 0, x.125)"
              data-h2-color="base(darkest.tm-blue)"
            >
              {intl.formatMessage(commonMessages.unSaved)}
            </span>
          )}
          {contextIsVisible && (
            <button
              type="button"
              className="input-label-context-button"
              data-h2-margin="base(0, 0, 0, x.125)"
              onClick={clickHandler}
            >
              <span data-h2-visibility="base(invisible)">
                {intl.formatMessage({
                  defaultMessage: "Toggle context",
                  id: "jhImZp",
                  description:
                    "Label to toggle the context description of an input.",
                })}
              </span>
              {contextIsActive ? (
                <XCircleIcon
                  style={{ width: "calc(1rem/1.25)" }}
                  data-h2-color="base(dt-primary)"
                />
              ) : (
                <QuestionMarkCircleIcon
                  style={{ width: "calc(1rem/1.25)" }}
                  data-h2-color="base(dt-primary)"
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
