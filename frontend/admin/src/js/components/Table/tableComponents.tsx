import React, { HTMLAttributes } from "react";
import { useIntl } from "react-intl";

export const IndeterminateCheckbox: React.FC<
  React.HTMLProps<HTMLInputElement> & {
    indeterminate: boolean;
    labelText?: string;
  }
> = ({ indeterminate, labelText, ...rest }) => {
  const intl = useIntl();
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <label htmlFor="column-fieldset-toggle-all">
      <input
        id="column-fieldset-toggle-all"
        type="checkbox"
        ref={ref}
        {...rest}
      />{" "}
      {labelText ||
        intl.formatMessage({
          defaultMessage: "Toggle All",
          description: "Label displayed on the Table Columns toggle fieldset.",
        })}
    </label>
  );
};

export const Spacer: React.FC = ({ children }) => (
  <div data-h2-margin="b(left, s)" style={{ flexShrink: 0 }}>
    {children}
  </div>
);

export const ButtonIcon: React.FC<{
  icon: React.FC<HTMLAttributes<HTMLOrSVGElement>>;
}> = ({ icon }) => {
  const Icon = icon;

  return (
    <Icon
      style={{ height: "1em", width: "1rem" }}
      data-h2-margin="b(right, xs)"
    />
  );
};
