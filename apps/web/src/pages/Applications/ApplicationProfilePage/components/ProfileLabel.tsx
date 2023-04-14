import React from "react";

interface ProfileLabelProps {
  children: React.ReactNode;
}

const ProfileLabel = ({ children }: ProfileLabelProps) => (
  <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
    {children}
  </span>
);

export default ProfileLabel;
