import React, { DetailedHTMLProps } from "react";

const DismissBtn: React.FC<
  DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ className, children, onClick, disabled, ...rest }) => (
  <button
    data-h2-position="b(absolute)"
    data-h2-location="b(top-right, m)"
    type="button"
    className={className}
    onClick={onClick}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  color: "red" | "gold";
  position: "static" | "toast";
  dismissBtn?: React.ReactElement;
}

export interface AlertComposition {
  DismissBtn: React.FC<
    DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >;
}

const Alert: React.FC<AlertProps> & AlertComposition = ({
  color,
  position,
  dismissBtn,
  className,
  children,
  ...rest
}) => {
  const locationStyles = {
    toast: {
      "data-h2-position": "b(fixed)",
      "data-h2-location": "b(bottom-right, m)",
    },
    static: {
      "data-h2-position": "b(relative)",
    },
  };
  const colorStyles = {
    red: {
      "data-h2-border": "b(red, all, solid, s)",
      "data-h2-bg-color": "b(red[.1])",
    },
    gold: {
      "data-h2-border": "b(gold, all, solid, s)",
      "data-h2-bg-color": "b(gold[.1])",
    },
  };
  return (
    <div
      {...locationStyles[position]}
      {...colorStyles[color]}
      data-h2-padding="b(all, s)"
      data-h2-radius="b(s)"
    >
      <div role="alert" className={className} {...rest}>
        {dismissBtn}
        <div>{children}</div>
      </div>
    </div>
  );
};

// We expose the children components here, as properties.
// Using the dot notation we explicitly set the composition relationships
// between the Alert component and its sub components.
Alert.DismissBtn = DismissBtn;

export default Alert;
