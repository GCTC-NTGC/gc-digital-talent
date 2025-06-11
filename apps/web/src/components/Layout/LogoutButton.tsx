import { HTMLProps, ReactNode, forwardRef } from "react";

interface LogoutButtonProps extends HTMLProps<HTMLButtonElement> {
  children: ReactNode;
}

const LogoutButton = forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ children, ...rest }, forwardedRef) => (
    <button
      ref={forwardedRef}
      className="bg-none p-0 text-base text-black underline hover:text-secondary iap:text-primary iap:hover:text-primary-600 iap:dark:text-primary-100 iap:dark:hover:text-white"
      {...rest}
      type="button"
    >
      {children}
    </button>
  ),
);

export default LogoutButton;
