import React from "react";

import Description, { DescriptionProps } from "./Description";

const Error = (props: Omit<DescriptionProps, "color">) => {
  return (
    <Description role="alert" aria-live="polite" color="error" {...props} />
  );
};

export default Error;
