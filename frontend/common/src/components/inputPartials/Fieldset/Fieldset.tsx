import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
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
  context?: string | React.ReactNode;
  /** If true, all input elements in this fieldset will be disabled. */
  disabled?: boolean;
  /** If true, and required is false, 'Optional' will not be shown above the fieldset. */
  hideOptional?: boolean;
  /** If true, the legend will be hidden */
  hideLegend?: boolean;
}

const Fieldset: React.FC<FieldsetProps> = ({
  legend,
  name,
  required,
  error,
  context,
  disabled,
  hideOptional,
  hideLegend,
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
      data-h2-margin="base(0, 0, x.125, 0)"
    >
      <legend data-h2-visibility="base(invisible)">{legend}</legend>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(flex-start)"
        data-h2-margin="base(0, 0, x.125, 0)"
      >
        {
          /** If hideLegend is true, legend will not be shown (but still exists in the legend tag above). */
          !hideLegend && (
            <span
              aria-hidden="true"
              role="presentation"
              data-h2-font-size="base(caption)"
              data-h2-margin="base(0, x.125, 0, 0)"
            >
              {legend}
            </span>
          )
        }
        <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
          {
            /** If hideOptional is true, only show text if required is true. */
            (required || !hideOptional) && (
              <span
                data-h2-font-size="base(caption)"
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
          {context && (
            <button
              type="button"
              className="input-label-context-button"
              data-h2-margin="base(0, 0, 0, x.125)"
              onClick={() =>
                setContextIsActive((currentState) => !currentState)
              }
            >
              <span data-h2-visibility="base(invisible)">
                {intl.formatMessage({
                  defaultMessage: "Toggle context",
                  id: "2W9CMn",
                  description:
                    "Label to toggle the context description of a field set.",
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
      <div
        data-h2-border="base(all, 1px, solid, dt-gray)"
        data-h2-background-color="base(dt-white)"
        data-h2-radius="base(input)"
        data-h2-padding="base(x.5, x.75, x.75, x.75)"
      >
        {children}
      </div>
      {error && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
        >
          <InputError isVisible={!!error} error={error} />
        </div>
      )}
      {contextIsActive && context && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
        >
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
