import { useCallback, useMemo, useState } from "react";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";

import { HeadingProps, IconType } from "@gc-digital-talent/ui";

interface GetToggleSectionIconArgs {
  isEditing: boolean;
  fallback: IconType;
  completed?: boolean | null;
  error?: boolean | null;
  optional?: boolean | null;
}

export type SectionIcon = {
  icon: IconType;
  color?: HeadingProps["color"];
};

type GetToggleSectionIconFn = (args: GetToggleSectionIconArgs) => SectionIcon;

const getToggleSectionIcon: GetToggleSectionIconFn = ({
  isEditing,
  fallback = InformationCircleIcon,
  completed,
  error,
  optional,
}) => {
  if (isEditing) {
    return {
      icon: PencilSquareIcon,
      color: "secondary",
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

  if (optional) {
    return {
      icon: QuestionMarkCircleIcon,
      color: "secondary",
    };
  }

  return {
    icon: fallback,
  };
};

interface UseToggleSectionInfoArgs {
  fallbackIcon: IconType;
  isNull: boolean;
  emptyRequired: boolean;
  optional?: boolean;
}

interface SectionInfo {
  icon: SectionIcon;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const useToggleSectionInfo = ({
  isNull,
  emptyRequired,
  fallbackIcon,
  optional,
}: UseToggleSectionInfoArgs): SectionInfo => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const icon = getToggleSectionIcon({
    isEditing,
    error: emptyRequired,
    completed: !isNull && !emptyRequired,
    fallback: fallbackIcon,
    optional,
  });

  const handleOpenChange = useCallback((newIsEditing: boolean) => {
    setIsEditing(newIsEditing);
  }, []);

  const sectionInfo = useMemo(
    () => ({
      isEditing,
      setIsEditing: handleOpenChange,
      icon,
    }),
    [handleOpenChange, icon, isEditing],
  );

  return sectionInfo;
};

export default useToggleSectionInfo;
