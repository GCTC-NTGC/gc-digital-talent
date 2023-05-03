import React, { useState } from "react";
import { useIntl } from "react-intl";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import InputContext from "../InputContext";
import InputError, { type InputFieldError } from "../InputError";
import InputUnsaved from "../InputUnsaved";

export interface FieldsetProps extends React.HTMLProps<HTMLFieldSetElement> {
  /** The text for the legend element. */
  legend: React.ReactNode;
  /** The name of this form control. */
  name: string;
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
  /** If true, the field set has unsaved changes */
  isUnsaved?: boolean;
  /** Strip basic styles to present a flat fieldset */
  flat?: boolean;
  /** ID of a field description (help text) */
  describedBy?: string;
}

const Fieldset = ({
  legend,
  name,
  required,
  error,
  context,
  disabled,
  hideOptional,
  hideLegend,
  children,
  isUnsaved,
  flat = false,
  trackUnsaved = true,
  describedBy,
  ...rest
}: FieldsetProps) => {
  const [contextIsActive, setContextIsActive] = useState(false);
  const intl = useIntl();
  const fieldState = useFieldState(name ?? "");
  const stateStyles = useFieldStateStyles(name ?? "", !trackUnsaved);
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id: name,
    describedBy,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context: context && contextIsActive,
    },
  });

  return (
    <fieldset
      name={name}
      disabled={disabled}
      style={{
        border: "0 none",
        padding: "0",
      }}
      data-h2-margin="base(0, 0, x.125, 0)"
      aria-describedby={ariaDescribedBy}
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
              data-h2-color="base(inherit)"
              {...(flat && { "data-h2-font-weight": "base(800)" })}
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
                  ? { "data-h2-color": "base(error.dark)" }
                  : { "data-h2-color": "base(gray.dark)" })}
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
              aria-controls={`context-${name}`}
              aria-expanded={contextIsActive}
              onClick={() =>
                setContextIsActive((currentState) => !currentState)
              }
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
      </div>
      <div
        {...(!flat && {
          ...stateStyles,
          "data-h2-radius": "base(input)",
          "data-h2-background": "base(white)",
          "data-h2-padding": "base(x.5, x.75, x.75, x.75)",
        })}
      >
        {children}
      </div>
      <InputUnsaved
        id={descriptionIds.unsaved}
        isVisible={fieldState === "dirty" && trackUnsaved}
      />
      {error && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
        >
          <InputError
            id={descriptionIds.error}
            isVisible={!!error}
            error={error}
          />
        </div>
      )}
      {contextIsActive && context && (
        <div
          data-h2-display="base(block)"
          data-h2-margin="base(x.125, 0, 0, 0)"
          id={descriptionIds.context}
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
