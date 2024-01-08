import BoltOutlineIcon from "@heroicons/react/24/outline/BoltIcon";
import BoltSolidIcon from "@heroicons/react/24/solid/BoltIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const indexSkillPageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Skills",
  id: "/UKT+/",
  description: "Title for skills",
});

export const indexSkillPageSolidIcon: IconType = BoltSolidIcon;
export const indexSkillPageOutlineIcon: IconType = BoltOutlineIcon;
