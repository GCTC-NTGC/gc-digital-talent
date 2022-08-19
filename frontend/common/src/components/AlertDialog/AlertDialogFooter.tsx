import React from "react";

export interface AlertDialogFooterProps {
  children: React.ReactNode;
}

const AlertDialogFooter = ({ children }: AlertDialogFooterProps) => (
  <div
    className="dialog__footer"
    data-h2-display="b(flex)"
    data-h2-align-items="b(center)"
    data-h2-justify-content="b(flex-end)"
    data-h2-margin="b(top, m)"
    data-h2-padding="b(top, m)"
    data-h2-border="b(darkgray, top, solid, s)"
  >
    {children}
  </div>
);

export default AlertDialogFooter;
