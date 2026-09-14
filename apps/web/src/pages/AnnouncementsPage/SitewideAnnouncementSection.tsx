import type { MessageDescriptor } from "react-intl";
import { defineMessage, useIntl } from "react-intl";
import MegaphoneSolidIcon from "@heroicons/react/24/solid/MegaphoneIcon";

import type {
  FragmentType,
  LocalizedString,
  SitewideAnnouncementInput,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import type { IconType } from "@gc-digital-talent/ui";
import { ToggleSection } from "@gc-digital-talent/ui";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import SitewideAnnouncementForm from "./SitewideAnnouncementForm";
import SitewideAnnouncementDisplay from "./SitewideAnnouncementDisplay";

export const SitewideAnnouncementSection_Fragment = graphql(/* GraphQL */ `
  fragment SitewideAnnouncementSection on SitewideAnnouncement {
    publishDate
    expiryDate
    title {
      en
      fr
    }
    message {
      en
      fr
    }

    ...SitewideAnnouncementDisplay
    ...SitewideAnnouncementForm
  }
`);

interface AnnouncementSectionData {
  publishDate?: string | null;
  expiryDate?: string | null;
  title: LocalizedString;
  message: LocalizedString;
}

const hasEmptyRequiredFields = (
  apiData: AnnouncementSectionData | null | undefined,
): boolean =>
  !apiData?.publishDate ||
  !apiData?.expiryDate ||
  !apiData?.title.en ||
  !apiData?.title.fr ||
  !apiData?.message.en ||
  !apiData?.message.fr;

const hasAllEmptyFields = (
  apiData: AnnouncementSectionData | null | undefined,
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
  query:
    | FragmentType<typeof SitewideAnnouncementSection_Fragment>
    | null
    | undefined;
  onUpdate: (data: SitewideAnnouncementInput) => Promise<void>;
  isSubmitting: boolean;
}

const SitewideAnnouncementSection = ({
  query,
  onUpdate,
  isSubmitting,
}: SitewideAnnouncementSectionProps) => {
  const intl = useIntl();
  const initialData = getFragment(SitewideAnnouncementSection_Fragment, query);
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
            <SitewideAnnouncementDisplay query={initialData} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <SitewideAnnouncementForm
            query={initialData}
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
