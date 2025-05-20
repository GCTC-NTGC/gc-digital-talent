import { useCallback, useMemo } from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { IconType } from "@gc-digital-talent/ui";
import { FieldLabels } from "@gc-digital-talent/forms/types";

import useToggleSectionInfo, {
  SectionIcon,
} from "~/hooks/useToggleSectionInfo";

import { useProfileFormContext } from "../components/ProfileFormContext";
import { SectionKey } from "../types";
import { getSectionLabels, getSectionTitle } from "../utils";

interface UseSectionInfoArgs {
  fallbackIcon: IconType;
  section: SectionKey;
  isNull: boolean;
  emptyRequired: boolean;
}

interface SectionInfo {
  title: MessageDescriptor;
  icon: SectionIcon;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  labels: FieldLabels;
}

const useSectionInfo = ({
  section,
  isNull,
  emptyRequired,
  fallbackIcon,
}: UseSectionInfoArgs): SectionInfo => {
  const intl = useIntl();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon,
  });
  const title = getSectionTitle(section);
  const labels = getSectionLabels(section, intl);
  const { toggleDirty } = useProfileFormContext();

  const handleOpenChange = useCallback(
    (newIsEditing: boolean) => {
      setIsEditing(newIsEditing);
      if (!newIsEditing) {
        toggleDirty(section, false);
      }
    },
    [section, setIsEditing, toggleDirty],
  );

  const sectionInfo = useMemo(
    () => ({
      labels,
      isEditing,
      setIsEditing: handleOpenChange,
      title,
      icon,
    }),
    [handleOpenChange, icon, isEditing, labels, title],
  );

  return sectionInfo;
};

export default useSectionInfo;
