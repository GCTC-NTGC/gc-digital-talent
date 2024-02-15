import * as React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import MegaphoneOutlineIcon from "@heroicons/react/24/outline/MegaphoneIcon";
import MegaphoneSolidIcon from "@heroicons/react/24/solid/MegaphoneIcon";

import {
  SitewideAnnouncement,
  SitewideAnnouncementInput,
} from "@gc-digital-talent/graphql";
import { IconType, ToggleSection } from "@gc-digital-talent/ui";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import SitewideAnnouncementForm from "./SitewideAnnouncementForm";
import SitewideAnnouncementDisplay from "./SitewideAnnouncementDisplay";

const hasEmptyRequiredFields = (
  apiData: SitewideAnnouncement | null | undefined,
): boolean => {
  return false;
};

const hasAllEmptyFields = (
  apiData: SitewideAnnouncement | null | undefined,
): boolean => {
  return false;
};

export const sectionTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Sitewide announcement",
  id: "gChYmW",
  description: "Page title for the update sitewide announcement page",
});
export const sectionOutlineIcon: IconType = MegaphoneOutlineIcon;
export const sectionSolidIcon: IconType = MegaphoneSolidIcon;

interface SitewideAnnouncementSectionProps {
  initialData: SitewideAnnouncement | null | undefined;
  onUpdate: (data: SitewideAnnouncementInput) => Promise<void>;
  isSubmitting: boolean;
}

const SitewideAnnouncementSection = ({
  initialData,
  onUpdate,
  isSubmitting,
}: SitewideAnnouncementSectionProps) => {
  const intl = useIntl();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull: hasAllEmptyFields(initialData),
    emptyRequired: hasEmptyRequiredFields(initialData),
    fallbackIcon: sectionSolidIcon,
  });

  return (
    <ToggleSection.Root
      id="sitewide-announcement-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h2"
        size="h3"
        toggle={
          <ToggleForm.LabelledTrigger
            sectionTitle={intl.formatMessage(sectionTitle)}
          />
        }
      >
        {intl.formatMessage(sectionTitle)}
      </ToggleSection.Header>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {hasAllEmptyFields(initialData) ? (
            <ToggleForm.NullDisplay />
          ) : (
            <SitewideAnnouncementDisplay initialData={initialData} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <SitewideAnnouncementForm
            initialData={initialData}
            onUpdate={onUpdate}
            setIsEditing={setIsEditing}
            isSubmitting={isSubmitting}
          />
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default SitewideAnnouncementSection;
