import { IntlShape, MessageDescriptor, defineMessage } from "react-intl";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import { HeadingProps, IconType } from "@gc-digital-talent/ui";
import { FieldLabels } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getLabels as getPersonalLabels } from "./components/PersonalInformation/utils";
import { getLabels as getWorkLabels } from "./components/WorkPreferences/utils";
import { getLabels as getGovLabels } from "./components/GovernmentInformation/utils";
import { getLabels as getLangLabels } from "./components/LanguageProfile/utils";
import { SectionKey } from "./types";

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
  [
    "account",
    defineMessage({
      defaultMessage: "Account and privacy settings",
      id: "SMWsMk",
      description:
        "Heading for the account and privacy settings section on the profile",
    }),
  ],
]);

export const getSectionTitle = (key: SectionKey): MessageDescriptor => {
  const title = sectionTitles.get(key);

  return title ?? commonMessages.notFound;
};

const labelAccessorMap = new Map<SectionKey, (intl: IntlShape) => FieldLabels>([
  ["personal", getPersonalLabels],
  ["work", getWorkLabels],
  ["government", getGovLabels],
  ["language", getLangLabels],
]);

export const getSectionLabels = (
  key: SectionKey,
  intl: IntlShape,
): FieldLabels => {
  const labels = labelAccessorMap.get(key);

  return labels ? labels(intl) : {};
};
