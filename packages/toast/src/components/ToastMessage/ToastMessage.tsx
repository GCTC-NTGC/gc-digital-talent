import React from "react";

interface ToastMessageProps {
  children: React.ReactNode;
}

const ToastMessage = ({ children }: ToastMessageProps) => (
  <div
    data-h2-padding="base(x2)"
    data-h2-line-height="base(var(--h2-base-line-height))"
  >
    {children}
  </div>
);

export default ToastMessage;
