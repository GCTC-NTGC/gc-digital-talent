import * as React from "react";

import { ButtonLinkMode } from "../../types";

interface TextWrapperProps {
  mode: ButtonLinkMode;
  newTab?: boolean;
  children?: React.ReactNode;
}

const TextWrapper = ({ mode, newTab = false, children }: TextWrapperProps) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!newTab && mode !== "cta") return <>{children}</>;

  return (
    <span
      {...(newTab && {
        "data-h2-display": "base(flex)",
        "data-h2-align-items": "base(center)",
      })}
      {...(mode === "cta" && {
        "data-h2-radius": "base(0 s s 0)",
        "data-h2-padding": "base(x.5 x1)",
      })}
    >
      {children}
    </span>
  );
};

export default TextWrapper;
