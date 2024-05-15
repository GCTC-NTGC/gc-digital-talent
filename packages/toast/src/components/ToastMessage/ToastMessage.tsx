import * as React from "react";

interface ToastMessageProps {
  children: React.ReactNode;
}

const ToastMessage = ({ children }: ToastMessageProps) => (
  <div
    data-h2-padding="base(x1) p-tablet(x1, x1, x1, x1.5)"
    data-h2-line-height="base(var(--h2-base-line-height))"
  >
    {children}
  </div>
);

export default ToastMessage;
