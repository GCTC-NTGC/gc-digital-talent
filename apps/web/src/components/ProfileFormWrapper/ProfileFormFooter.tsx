import * as React from "react";

import CancelButton, { type CancelButtonProps } from "./CancelButton";
import SaveButton from "./SaveButton";

export interface ProfileFormFooterProps {
  mode: "cancelButton" | "saveButton" | "bothButtons";
  children?: React.ReactNode;
  cancelLink?: CancelButtonProps;
  disabled?: boolean;
}

const ProfileFormFooter = ({
  mode,
  children,
  cancelLink,
  disabled,
}: ProfileFormFooterProps) => {
  const bottomButtons = () => {
    switch (mode) {
      case "bothButtons":
        return (
          <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
            <span
              data-h2-display="base(inline-block)"
              data-h2-margin="base(0, x1, 0, 0)"
            >
              <CancelButton {...cancelLink} />
            </span>
            <span
              data-h2-display="base(inline-block)"
              data-h2-margin="base(0, x1, 0, 0)"
            >
              <SaveButton disabled={disabled} />
            </span>
          </div>
        );
      case "cancelButton":
        return <CancelButton {...cancelLink} />;
      case "saveButton":
        return <SaveButton disabled={disabled} />;
      default:
        return null;
    }
  };
  return (
    <div data-h2-margin="base(x2, 0, x3, 0)" data-h2-display="base(flex)">
      {children}
      {bottomButtons()}
    </div>
  );
};

export default ProfileFormFooter;
