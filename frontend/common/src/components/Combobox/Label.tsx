import React from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { useIntl } from "react-intl";

import commonMessages from "../../messages/commonMessages";

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  hideOptional?: boolean;
}

const Label = ({ children, required, hideOptional = false }: LabelProps) => {
  const intl = useIntl();

  const appendLabel = required || !hideOptional;

  const labelStyles = {
    "data-h2-margin": "base(0, x.125, 0, 0)",
    "data-h2-flex-grow": appendLabel ? undefined : "base(1)",
  };

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(flex-start)"
      data-h2-width="base(100%)"
    >
      <ComboboxPrimitive.Label {...labelStyles}>
        {children}
      </ComboboxPrimitive.Label>
      {appendLabel && (
        <div
          data-h2-position="base(relative)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          style={{ zIndex: 10 }}
        >
          {(required || !hideOptional) && (
            <span
              data-h2-font-size="base(caption)"
              data-h2-display="base(inline-block)"
              data-h2-margin="base(0, 0, 0, x.125)"
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
          )}
        </div>
      )}
    </div>
  );
};

export default Label;
