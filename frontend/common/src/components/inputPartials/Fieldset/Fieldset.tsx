import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "../../../messages";
import InputContext from "../InputContext/InputContext";
import InputError from "../InputError/InputError";

export interface FieldsetProps {
  /** The text for the legend element. */
  legend: string;
  /** The name of this form control. */
  name?: string;
  /** Controls whether Required or Optional text appears above the fieldset. */
  required?: boolean;
  /** If an error string is provided, it will appear below the fieldset inputs. */
  error?: string;
  /** If a context string is provided, a small button will appear which, when toggled, shows the context string. */
  context?: string;
  /** If true, all input elements in this fieldset will be disabled. */
  disabled?: boolean;
  /** If true, and required is false, 'Optional' will not be shown above the fieldset. */
  hideOptional?: boolean;
}

const Fieldset: React.FC<FieldsetProps> = ({
  legend,
  name,
  required,
  error,
  context,
  disabled,
  hideOptional,
  children,
}) => {
  const [contextIsActive, setContextIsActive] = useState(false);
  const intl = useIntl();
  return (
    <fieldset
      name={name}
      disabled={disabled}
      style={{
        border: "0 none",
        padding: "0",
      }}
      data-h2-margin="b(bottom, xxs)"
    >
      <legend data-h2-visibility="b(invisible)">{legend}</legend>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-wrap="b(wrap)"
        data-h2-margin="b(bottom, xxs)"
      >
        <div style={{ flex: "1" }}>
          <span
            aria-hidden="true"
            role="presentation"
            data-h2-font-size="b(caption)"
          >
            {legend}
          </span>
        </div>
        <div>
          {
            /** If hideOptional is true, only show text if required is true. */
            (required || !hideOptional) && (
              <span
                data-h2-font-size="b(caption)"
                {...(required
                  ? { "data-h2-font-color": "b(red)" }
                  : { "data-h2-font-color": "b(darkgray" })}
              >
                {required
                  ? intl.formatMessage(commonMessages.required)
                  : intl.formatMessage(commonMessages.optional)}
              </span>
            )
          }
          {context && (
            <button
              type="button"
              className="input-label-context-button"
              data-h2-margin="b(left, xxs)"
              onClick={() =>
                setContextIsActive((currentState) => !currentState)
              }
            >
              <span data-h2-visibility="b(invisible)">
                {intl.formatMessage({
                  defaultMessage: "Toggle context",
                  description:
                    "Label to toggle the context description of a field set.",
                })}
              </span>
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
      <div
        data-h2-border="b(darkgray, all, solid, s)"
        data-h2-radius="b(s)"
        data-h2-padding="b(right-left, s) b(top, xxs)"
      >
        {children}
      </div>
      {error && (
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputError isVisible={!!error} error={error} />
        </div>
      )}
      {contextIsActive && context && (
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputContext
            isVisible={contextIsActive && !!context}
            context={context}
          />
        </div>
      )}
    </fieldset>
  );
};

export default Fieldset;
