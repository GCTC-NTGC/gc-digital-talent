import React from "react";

import { CommonInputProps } from "../../types";

interface WrapperProps {
  id: CommonInputProps["id"];
  hideLabel?: boolean;
  label: CommonInputProps["label"];
  children: React.ReactNode;
}

const Wrapper = ({ id, hideLabel, label, children }: WrapperProps) => {
  // Note: Here for type purposes
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (hideLabel) return <>{children}</>;

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(x.25)"
    >
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
};

export default Wrapper;
