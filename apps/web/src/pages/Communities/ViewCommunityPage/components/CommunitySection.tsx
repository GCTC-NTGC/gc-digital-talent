import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import MegaphoneSolidIcon from "@heroicons/react/24/solid/MegaphoneIcon";
import { useOutletContext } from "react-router-dom";

import {
  Community,
  FragmentType,
  getFragment,
  graphql,
  UpdateCommunityInput,
} from "@gc-digital-talent/graphql";
import { IconType, ToggleSection } from "@gc-digital-talent/ui";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import CommunityForm from "./CommunityForm";
import CommunityDisplay from "./CommunityDisplay";
import { ContextType } from "../../CommunityMembersPage/components/types";

const ViewCommunityPage_CommunityFragment = graphql(/* GraphQL */ `
  fragment ViewCommunityPage_Community on Community {
    id
    key
    name {
      en
      fr
    }
    description {
      en
      fr
    }
  }
`);

type ViewCommunityPageFragment = FragmentType<
  typeof ViewCommunityPage_CommunityFragment
>;

const hasEmptyRequiredFields = (
  apiData: Community | null | undefined,
): boolean =>
  !apiData?.name?.en ||
  !apiData?.name?.fr ||
  !apiData?.description?.en ||
  !apiData?.description?.fr ||
  !apiData?.key;

const hasAllEmptyFields = (apiData: Community | null | undefined): boolean =>
  !apiData?.name?.en &&
  !apiData?.name?.fr &&
  !apiData?.description?.en &&
  !apiData?.description?.fr &&
  !apiData?.key;

const sectionTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Community information",
  id: "W0Bh1G",
  description: "Title for community information",
});
const sectionSolidIcon: IconType = MegaphoneSolidIcon;

interface CommunitySectionProps {
  initialData: ViewCommunityPageFragment | undefined;
  onUpdate: (data: UpdateCommunityInput) => Promise<void>;
  isSubmitting: boolean;
}

const CommunitySection = ({
  initialData,
  onUpdate,
  isSubmitting,
}: CommunitySectionProps) => {
  const intl = useIntl();
  const data = getFragment(ViewCommunityPage_CommunityFragment, initialData);
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull: hasAllEmptyFields(data),
    emptyRequired: hasEmptyRequiredFields(data),
    fallbackIcon: sectionSolidIcon,
  });
  const { canAdmin } = useOutletContext<ContextType>();

  return (
    <ToggleSection.Root
      id="community-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h2"
        size="h3"
        toggle={
          canAdmin ? (
            <ToggleForm.LabelledTrigger
              sectionTitle={intl.formatMessage(sectionTitle)}
            />
          ) : undefined
        }
      >
        {intl.formatMessage(sectionTitle)}
      </ToggleSection.Header>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {hasAllEmptyFields(data) ? (
            <ToggleForm.NullDisplay />
          ) : (
            <CommunityDisplay initialData={data} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <CommunityForm
            initialData={data}
            onUpdate={onUpdate}
            onOpenChange={setIsEditing}
            isSubmitting={isSubmitting}
          />
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default CommunitySection;
