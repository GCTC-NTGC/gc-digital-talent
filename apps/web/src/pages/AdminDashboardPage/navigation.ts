import HomeOutlineIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeSolidIcon from "@heroicons/react/24/solid/HomeIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Dashboard",
  id: "ArwIQV",
  description: "Title for dashboard",
});

export const pageOutlineIcon: IconType = HomeOutlineIcon;
export const pageSolidIcon: IconType = HomeSolidIcon;
