import type { DetailedHTMLProps, LabelHTMLAttributes } from "react";
import { forwardRef } from "react";
import { useIntl } from "react-intl";

import type { Locales } from "@gc-digital-talent/i18n";
import { appendLanguageName } from "@gc-digital-talent/i18n";

import Required from "./Required";
import { labelStyles } from "./styles";

export interface LabelProps extends DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> {
  required?: boolean;
  appendLanguageToLabel?: Locales;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    { required, appendLanguageToLabel, children, className, ...rest },
    forwardedRef,
  ) => {
    const intl = useIntl();
    return (
      <label
        ref={forwardedRef}
        className={labelStyles({ class: className })}
        {...rest}
      >
        {appendLanguageToLabel
          ? appendLanguageName({
              label: children,
              lang: appendLanguageToLabel,
              intl,
              formatted: true,
            })
          : children}
        <Required required={required} />
      </label>
    );
  },
);

export default Label;
