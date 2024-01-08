import SquaresPlusOutlineIcon from "@heroicons/react/24/outline/SquaresPlusIcon";
import SquaresPlusSolidIcon from "@heroicons/react/24/solid/SquaresPlusIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Processes",
  id: "Mi+AuD",
  description: "Title for the index pool page",
});

export const pageOutlineIcon: IconType = SquaresPlusOutlineIcon;
export const pageSolidIcon: IconType = SquaresPlusSolidIcon;
