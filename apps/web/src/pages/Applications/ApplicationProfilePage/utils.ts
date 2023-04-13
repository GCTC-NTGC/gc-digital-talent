import { HeadingProps } from "@gc-digital-talent/ui";
import {
  PencilSquareIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type IconType = React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;

interface GetSectionIconArgs {
  isEditing: boolean;
  fallback: IconType;
  completed?: boolean | null;
  error?: boolean | null;
}

export type SectionIcon = {
  icon: IconType;
  color?: HeadingProps["color"];
};

type GetSectionIconFn = (args: GetSectionIconArgs) => SectionIcon;

export const getSectionIcon: GetSectionIconFn = ({
  isEditing,
  fallback = InformationCircleIcon,
  completed,
  error,
}) => {
  if (isEditing) {
    return {
      icon: PencilSquareIcon,
      color: "warning",
    };
  }

  if (error) {
    return {
      icon: ExclamationCircleIcon,
      color: "error",
    };
  }

  if (completed) {
    return {
      icon: CheckCircleIcon,
      color: "success",
    };
  }

  return {
    icon: fallback,
  };
};
