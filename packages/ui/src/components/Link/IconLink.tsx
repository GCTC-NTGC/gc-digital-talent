import React from "react";

import Link from "./Link";
import type { LinkProps } from "./Link";

const IconLink = (props: Omit<LinkProps, "ref">) => {
  return <Link {...props} />;
};

export default IconLink;
