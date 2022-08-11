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
          <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
            <span
              data-h2-display="base(inline-block)"
              data-h2-margin="base(0, x1, 0, 0)"
            >
              <CancelButton link={link} />
            </span>
            <span
              data-h2-display="base(inline-block)"
              data-h2-margin="base(0, x1, 0, 0)"
            >
              <SaveButton />
            </span>
          </div>
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
    <div data-h2-margin="base(x2, 0, x3, 0)" data-h2-display="base(flex)">
      {children}
      {bottomButtons()}
    </div>
  );
};

export default ProfileFormFooter;
