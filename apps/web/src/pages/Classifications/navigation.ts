import TagOutlineIcon from "@heroicons/react/24/outline/TagIcon";
import TagSolidIcon from "@heroicons/react/24/solid/TagIcon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const indexClassificationPageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Classifications",
  id: "kvpRgN",
  description: "Title for classifications",
});

export const indexClassificationPageOutlineIcon: IconType = TagOutlineIcon;
export const indexClassificationPageSolidIcon: IconType = TagSolidIcon;
