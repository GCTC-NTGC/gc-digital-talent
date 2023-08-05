import React from "react";

import { IconType } from "@gc-digital-talent/ui";

type PageNavLink = {
  label?: React.ReactNode;
  url: string;
};

export type PageNavInfo = {
  icon: IconType;
  title: string;
  link: PageNavLink;
};
