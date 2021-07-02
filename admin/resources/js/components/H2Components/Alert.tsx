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

type TitleProps = React.HTMLAttributes<HTMLParagraphElement>;
const Title: React.FC<TitleProps> = ({ className, children, ...rest }) => (
  <p className={className} {...rest}>
    {children}
  </p>
);

interface AlertComposition {
  DismissBtn: React.FC<
    DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >;
  Title: React.FunctionComponent<TitleProps>;
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  position: "static" | "toast";
  dismissBtn?: React.ReactElement;
}

const Alert: React.FC<AlertProps> & AlertComposition = ({
  color,
  position,
  dismissBtn,
  className,
  children,
  ...rest
}) => (
  <div
    data-h2-position={position === "toast" ? "b(fixed)" : "b(relative)"}
    data-h2-location={position === "toast" ? "b(bottom-right, m)" : ""}
    data-h2-padding="b(all, s)"
    data-h2-radius="b(s)"
    data-h2-border={`b(${color}, all, solid, s)`}
    data-h2-bg-color={`b(${color}[.1])`}
  >
    <div role="alert" className={className} {...rest}>
      {dismissBtn}
      <div>{children}</div>
    </div>
  </div>
);

// We expose the children components here, as properties.
// Using the dot notation we explicitly set the composition relationships
// between the Alert component and its sub components.
Alert.DismissBtn = DismissBtn;
Alert.Title = Title;

export default Alert;
