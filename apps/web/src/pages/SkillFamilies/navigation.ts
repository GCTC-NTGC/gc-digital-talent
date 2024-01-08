import CloudOutlineIcon from "@heroicons/react/24/outline/CloudIcon";
import CloudSolidIcon from "@heroicons/react/24/solid/CloudIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const indexSkillFamilyPageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Skill families",
  id: "0E9hiS",
  description: "Title for skill families",
});

export const indexSkillFamilyPageOutlineIcon: IconType = CloudOutlineIcon;
export const indexSkillFamilyPageSolidIcon: IconType = CloudSolidIcon;
