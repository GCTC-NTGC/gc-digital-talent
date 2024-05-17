import { HTMLProps, ReactNode, forwardRef } from "react";

interface LogoutButtonProps extends HTMLProps<HTMLButtonElement> {
  children: ReactNode;
}
const LogoutButton = forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ children, ...rest }, forwardedRef) => (
    <button
      className="bg-none p-0 underline"
      data-h2-color="base(black) base:hover(primary) base:iap(primary) base:iap:dark(primary.lightest) base:iap:hover(primary.darker) base:iap:dark:hover(black)"
      ref={forwardedRef}
      {...rest}
      type="button"
    >
      {children}
    </button>
  ),
);

export default LogoutButton;
