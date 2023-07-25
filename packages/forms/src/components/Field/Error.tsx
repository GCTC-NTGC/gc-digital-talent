import React from "react";

import Context, { ContextProps } from "./Context";

const Error = (props: Omit<ContextProps, "color">) => {
  return <Context role="alert" aria-live="polite" color="error" {...props} />;
};

export default Error;
