import PaperAirplaneOutlineIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import PaperAirplaneSolidIcon from "@heroicons/react/24/solid/PaperAirplaneIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Talent requests",
  id: "3NW70Q",
  description: "Title for the index search request page",
});

export const pageOutlineIcon: IconType = PaperAirplaneOutlineIcon;
export const pageSolidIcon: IconType = PaperAirplaneSolidIcon;
