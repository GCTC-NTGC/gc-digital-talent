import UserCircleOutlineIcon from "@heroicons/react/24/outline/UserCircleIcon";
import UserCircleSolidIcon from "@heroicons/react/24/solid/UserCircleIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "All users",
  id: "bVQ/rm",
  description: "Title for the index user page",
});

export const pageOutlineIcon: IconType = UserCircleOutlineIcon;
export const pageSolidIcon: IconType = UserCircleSolidIcon;
