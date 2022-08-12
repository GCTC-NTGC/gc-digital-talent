import * as React from "react";
import CancelButton, { type CancelButtonProps } from "./CancelButton";
import SaveButton from "./SaveButton";

export interface ProfileFormFooterProps {
  mode: "cancelButton" | "saveButton" | "bothButtons";
  cancelLink?: CancelButtonProps;
}

const ProfileFormFooter: React.FunctionComponent<ProfileFormFooterProps> = ({
  mode,
  children,
  cancelLink,
}) => {
  const bottomButtons = () => {
    switch (mode) {
      case "bothButtons":
        return (
          <>
            <span data-h2-padding="b(right, xs)">
              <CancelButton {...cancelLink} />
            </span>
            <span>
              <SaveButton />
            </span>
          </>
        );
      case "cancelButton":
        return <CancelButton {...cancelLink} />;
      case "saveButton":
        return <SaveButton />;
      default:
        return null;
    }
  };
  return (
    <div data-h2-margin="b(top-bottom, l)" data-h2-display="b(flex)">
      {children}
      {bottomButtons()}
    </div>
  );
};

export default ProfileFormFooter;
