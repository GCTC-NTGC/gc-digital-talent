import IdentificationOutlineIcon from "@heroicons/react/24/outline/IdentificationIcon";
import IdentificationSolidIcon from "@heroicons/react/24/solid/IdentificationIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Candidate search",
  id: "i16C7G",
  description: "Title for the all pool candidates page",
});

export const pageOutlineIcon: IconType = IdentificationOutlineIcon;
export const pageSolidIcon: IconType = IdentificationSolidIcon;
