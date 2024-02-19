import React from "react";

interface LogoutButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: React.ReactNode;
}
const LogoutButton = React.forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ children, ...rest }, forwardedRef) => (
    <button
      data-h2-color="base(black) base:hover(primary) base:iap(primary) base:iap:dark(primary.lightest) base:iap:hover(primary.darker) base:iap:dark:hover(black)"
      data-h2-font-size="base(normal)"
      data-h2-text-decoration="base(underline)"
      data-h2-padding="base(0)"
      style={{
        background: "none",
      }}
      ref={forwardedRef}
      {...rest}
      type="button"
    >
      {children}
    </button>
  ),
);

export default LogoutButton;
