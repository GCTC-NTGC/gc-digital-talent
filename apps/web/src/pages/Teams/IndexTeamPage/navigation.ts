import UsersOutlineIcon from "@heroicons/react/24/outline/UsersIcon";
import UsersSolidIcon from "@heroicons/react/24/solid/UsersIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Teams",
  id: "Ezh14X",
  description: "Title for the index team page",
});

export const pageOutlineIcon: IconType = UsersOutlineIcon;
export const pageSolidIcon: IconType = UsersSolidIcon;
