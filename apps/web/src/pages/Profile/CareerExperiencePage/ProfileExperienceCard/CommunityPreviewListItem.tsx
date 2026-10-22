import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { PreviewList } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import { useExperienceInfo } from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";
import CommunityExperienceDialog from "~/components/ExperienceDialog/CommunityExperienceDialog";

import type { ExperienceItemProps } from "./types";

export const CommunityExperienceItem_Fragment = graphql(/* GraphQL */ `
  fragment CommunityExperienceItem on CommunityExperience {
    ...CommunityExperienceDialog
    id
    title
    organization
    startDate
    endDate
    skills {
      id
    }
  }
`);

const CommunityPreviewListItem = ({
  experienceQuery,
  index,
  listLength,
}: ExperienceItemProps<
  FragmentType<typeof CommunityExperienceItem_Fragment>
>) => {
  const intl = useIntl();
  const experience = getFragment(
    CommunityExperienceItem_Fragment,
    experienceQuery,
  );

  const { title, typeMessage, date } = useExperienceInfo(experience);

  return (
    <PreviewList.Item
      key={experience.id}
      title={title}
      metaData={[
        {
          key: `${experience.id}-type`,
          type: "text",
          children: typeMessage,
        },
        {
          key: `${experience.id}-date`,
          type: "text",
          children: date,
        },
        {
          key: `${experience.id}-skillCount`,
          type: "text",
          children:
            (experience?.skills?.length ?? 0) +
            " " +
            intl.formatMessage(navigationMessages.skills),
        },
      ]}
      action={
        <CommunityExperienceDialog
          experienceQuery={experience}
          trigger={
            <PreviewList.Button
              label={intl.formatMessage(experienceMessages.showDetails, {
                experienceName: title,
              })}
            />
          }
        />
      }
      mode="experience"
      index={index}
      groupLength={listLength}
    >
      <p>{experience.organization}</p>
    </PreviewList.Item>
  );
};

export default CommunityPreviewListItem;
