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
      aria-required={required ? "true" : undefined}
      style={{
        border: "0 none",
        padding: "0",
      }}
      data-h2-margin="b(0, 0, x.125, 0)"
    >
      <legend data-h2-visibility="b(invisible)">{legend}</legend>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-wrap="b(wrap)"
        data-h2-margin="b(0, 0, x.125, 0)"
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
                  ? { "data-h2-color": "b(dt-error)" }
                  : { "data-h2-color": "b(dark.dt-gray)" })}
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
              data-h2-margin="b(0, 0, 0, x.125)"
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
                  data-h2-color="b(dt-primary)"
                />
              ) : (
                <QuestionMarkCircleIcon
                  style={{ width: "calc(1rem/1.25)" }}
                  data-h2-color="b(dt-primary)"
                />
              )}
            </button>
          )}
        </div>
      </div>
      <div
        data-h2-border="b(all, 1px, solid, dt-gray)"
        data-h2-radius="b(input)"
        data-h2-padding="b(x.125, x.5, 0, x.5)"
      >
        {children}
      </div>
      {error && (
        <div data-h2-display="b(block)" data-h2-margin="b(x.125, 0, 0, 0)">
          <InputError isVisible={!!error} error={error} />
        </div>
      )}
      {contextIsActive && context && (
        <div data-h2-display="b(block)" data-h2-margin="b(x.125, 0, 0, 0)">
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
