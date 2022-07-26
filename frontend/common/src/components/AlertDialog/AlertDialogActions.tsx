import React from "react";

export interface AlertDialogActionsProps {
  children: React.ReactNode;
}

const AlertDialogActions = ({ children }: AlertDialogActionsProps) => (
  <div
    className="dialog__footer"
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-justify-content="base(flex-end)"
    data-h2-margin="base(x1, 0, 0, 0)"
    data-h2-padding="base(x1, 0, 0, 0)"
    data-h2-border="base(top, 1px, solid, dt-gray.dark)"
  >
    {children}
  </div>
);

export default AlertDialogActions;
