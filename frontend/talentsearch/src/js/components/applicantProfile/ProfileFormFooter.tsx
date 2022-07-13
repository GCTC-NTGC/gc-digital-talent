import * as React from "react";
import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";

export interface ProfileFormFooterProps {
  mode: "cancelButton" | "saveButton" | "bothButtons";
  link?: string;
}

const ProfileFormFooter: React.FunctionComponent<ProfileFormFooterProps> = ({
  mode,
  children,
  link,
}) => {
  const bottomButtons = () => {
    switch (mode) {
      case "bothButtons":
        return (
          <>
            <span data-h2-padding="base(0, x.25, 0, 0)">
              <CancelButton link={link} />
            </span>
            <span>
              <SaveButton />
            </span>
          </>
        );
      case "cancelButton":
        return <CancelButton />;
      case "saveButton":
        return <SaveButton />;
      default:
        return null;
    }
  };
  return (
    <div data-h2-margin="base(x2, auto)" data-h2-display="base(flex)">
      {children}
      {bottomButtons()}
    </div>
  );
};

export default ProfileFormFooter;
