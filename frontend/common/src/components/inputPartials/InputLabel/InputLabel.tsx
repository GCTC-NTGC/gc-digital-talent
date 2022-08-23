import React, { useState } from "react";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { commonMessages } from "../../../messages";

export interface InputLabelProps {
  inputId: string;
  label: string | React.ReactNode;
  labelSize?: object;
  required: boolean;
  contextIsVisible?: boolean;
  contextToggleHandler?: (contextIsActive: boolean) => void;
  hideOptional?: boolean;
  hideBottomMargin?: boolean;
}

const InputLabel: React.FC<InputLabelProps> = ({
  inputId,
  label,
  labelSize,
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

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(flex-start)"
      {...(!hideBottomMargin && {
        "data-h2-margin": "base(0, 0, x.125, 0)",
      })}
    >
      <label
        {...labelSize}
        data-h2-margin="base(0, x.125, 0, 0)"
        htmlFor={inputId}
      >
        {label}
      </label>
      <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
        {
          /** If hideOptional is true, only show text if required is true. */
          (required || !hideOptional) && (
            <span
              data-h2-font-size="base(caption)"
              data-h2-display="base(inline-block)"
              data-h2-margin="base(0, 0, 0, x.125)"
              {...(required
                ? { "data-h2-color": "base(dt-error)" }
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
    </div>
  );
};

export default InputLabel;
