import BuildingOffice2OutlineIcon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import BuildingOffice2SolidIcon from "@heroicons/react/24/solid/BuildingOffice2Icon";
import { MessageDescriptor, defineMessage } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";

export const indexDepartmentPageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Departments",
  id: "+d/NdU",
  description: "Title for departments",
});

export const indexDepartmentPageOutlineIcon: IconType =
  BuildingOffice2OutlineIcon;
export const indexDepartmentPageSolidIcon: IconType = BuildingOffice2SolidIcon;
