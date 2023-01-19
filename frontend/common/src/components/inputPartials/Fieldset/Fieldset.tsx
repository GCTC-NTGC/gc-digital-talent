import React, { useState } from "react";
import { useIntl } from "react-intl";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useFieldState, useFieldStateStyles } from "../../../helpers/formUtils";
import { commonMessages } from "../../../messages";
import InputContext from "../InputContext/InputContext";
import InputError, { type InputFieldError } from "../InputError/InputError";
import InputUnsaved from "../InputUnsaved/InputUnsaved";

export interface FieldsetProps extends React.HTMLProps<HTMLFieldSetElement> {
  /** The text for the legend element. */
  legend: React.ReactNode;
  /** The name of this form control. */
  name?: string;
  /** Controls whether Required or Optional text appears above the fieldset. */
  required?: boolean;
  /** If an error string is provided, it will appear below the fieldset inputs. */
  error?: InputFieldError;
  /** If a context string is provided, a small button will appear which, when toggled, shows the context string. */
  context?: string | React.ReactNode;
  /** If true, all input elements in this fieldset will be disabled. */
  disabled?: boolean;
  /** If true, and required is false, 'Optional' will not be shown above the fieldset. */
  hideOptional?: boolean;
  /** If true, the legend will be hidden */
  hideLegend?: boolean;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
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
  trackUnsaved = true,
  ...rest
}) => {
  const [contextIsActive, setContextIsActive] = useState(false);
  const intl = useIntl();
  const fieldState = useFieldState(name ?? "");
  const stateStyles = useFieldStateStyles(name ?? "", !trackUnsaved);

  const ariaDescription = rest["aria-describedby"];

  return (
    <fieldset
      name={name}
      disabled={disabled}
      style={{
        border: "0 none",
        padding: "0",
      }}
      data-h2-margin="base(0, 0, x.125, 0)"
      {...rest}
    >
      <legend data-h2-visually-hidden="base(invisible)">{legend}</legend>
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
                  ? { "data-h2-color": "base(dt-error.dark)" }
                  : { "data-h2-color": "base(dt-gray.dark)" })}
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
              <span data-h2-visually-hidden="base(invisible)">
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
        {...stateStyles}
        data-h2-radius="base(input)"
        data-h2-padding="base(x.5, x.75, x.75, x.75)"
      >
        {children}
      </div>
      <InputUnsaved
        id={ariaDescription}
        isVisible={fieldState === "dirty" && trackUnsaved}
      />
      {error && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
        >
          <InputError id={ariaDescription} isVisible={!!error} error={error} />
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
