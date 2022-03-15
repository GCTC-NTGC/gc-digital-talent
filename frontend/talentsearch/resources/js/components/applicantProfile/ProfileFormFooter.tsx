import * as React from "react";
import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";

export interface ProfileFormFooterProps {
  mode: "cancelButton" | "saveButton" | "bothButtons";
  handleSave?: () => void;
}

const ProfileFormFooter: React.FunctionComponent<ProfileFormFooterProps> = ({
  mode,
  handleSave = () => {
    // do nothing.
  },
  children,
}) => {
  const bottomButtons = () => {
    switch (mode) {
      case "bothButtons":
        return (
          <>
            <span data-h2-padding="b(right, xs)">
              <CancelButton />
            </span>
            <span>
              <SaveButton handleSave={handleSave} />
            </span>
          </>
        );
      case "cancelButton":
        return <CancelButton />;
      case "saveButton":
        return <SaveButton handleSave={handleSave} />;
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
