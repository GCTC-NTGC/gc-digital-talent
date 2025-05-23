import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
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
): boolean =>
  !apiData?.publishDate ||
  !apiData?.expiryDate ||
  !apiData?.title.en ||
  !apiData?.title.fr ||
  !apiData?.message.en ||
  !apiData?.message.fr;

const hasAllEmptyFields = (
  apiData: SitewideAnnouncement | null | undefined,
): boolean =>
  !apiData?.publishDate &&
  !apiData?.expiryDate &&
  !apiData?.title.en &&
  !apiData?.title.fr &&
  !apiData?.message.en &&
  !apiData?.message.fr;

const sectionTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Sitewide announcement",
  id: "gChYmW",
  description: "Page title for the update sitewide announcement page",
});
const sectionSolidIcon: IconType = MegaphoneSolidIcon;

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
        icon={icon.icon}
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
            onOpenChange={setIsEditing}
            isSubmitting={isSubmitting}
          />
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default SitewideAnnouncementSection;
