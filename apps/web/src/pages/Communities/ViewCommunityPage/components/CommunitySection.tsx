import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import MegaphoneSolidIcon from "@heroicons/react/24/solid/MegaphoneIcon";

import {
  Community,
  FragmentType,
  getFragment,
  graphql,
  UpdateCommunityInput,
} from "@gc-digital-talent/graphql";
import { IconType, ToggleSection } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { checkRole } from "~/utils/teamUtils";

import CommunityForm from "./CommunityForm";
import CommunityDisplay from "./CommunityDisplay";

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

export type ViewCommunityPageFragment = FragmentType<
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
  id: "C1o0aS",
  description: "Section title for the community page",
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
  const { userAuthInfo } = useAuthorization();

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
          checkRole(
            [ROLE_NAME.CommunityAdmin, ROLE_NAME.PlatformAdmin],
            unpackMaybes(userAuthInfo?.roleAssignments),
          ) ? (
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
