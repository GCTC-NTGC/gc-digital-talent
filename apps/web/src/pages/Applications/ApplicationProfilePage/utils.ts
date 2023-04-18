import { MessageDescriptor, defineMessage } from "react-intl";
import {
  PencilSquareIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { HeadingProps } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { SectionKey } from "./types";

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

export const sectionTitles = new Map<SectionKey, MessageDescriptor>([
  [
    "personal",
    defineMessage({
      defaultMessage: "Personal and contact information",
      id: "fyEFN7",
      description:
        "Heading for the personal info section on the application profile",
    }),
  ],
  [
    "work",
    defineMessage({
      defaultMessage: "Work preferences",
      id: "XTaRza",
      description:
        "Heading for the work preferences section on the application profile",
    }),
  ],
  [
    "dei",
    defineMessage({
      defaultMessage: "Diversity, equity, and inclusion",
      id: "u1N0nT",
      description:
        "Heading for the diversity, equity, and inclusion section on the application profile",
    }),
  ],
  [
    "government",
    defineMessage({
      defaultMessage: "Government employee information",
      id: "AwzZwe",
      description:
        "Heading for the government information section on the application profile",
    }),
  ],
  [
    "language",
    defineMessage({
      defaultMessage: "Language profile",
      id: "Rn3HMc",
      description:
        "Heading for the language profile section on the application profile",
    }),
  ],
]);

export const getSectionTitle = (key: SectionKey): MessageDescriptor => {
  const title = sectionTitles.get(key);

  return title ?? commonMessages.notFound;
};
