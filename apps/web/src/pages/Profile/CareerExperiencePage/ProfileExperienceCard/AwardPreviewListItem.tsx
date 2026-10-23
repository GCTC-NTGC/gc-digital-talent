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
import AwardExperienceDialog from "~/components/ExperienceDialog/AwardExperienceDialog";

import type { ExperienceItemProps } from "./types";

export const AwardExperienceItem_Fragment = graphql(/* GraphQL */ `
  fragment AwardExperienceItem on AwardExperience {
    ...AwardExperienceDialog
    id
    title
    issuedBy
    awardedDate
    relatedExperience {
      ... on PersonalExperience {
        title
        organization
      }
      ... on CommunityExperience {
        title
        organization
      }
      ... on EducationExperience {
        educationType {
          value
          label {
            en
            fr
          }
        }
        areaOfStudy
        institution
        otherEducationType
        degreeType {
          label {
            en
            fr
          }
        }
        fellowshipType {
          value
          label {
            en
            fr
          }
        }
        otherFellowshipType
        licenseOrAccreditation
        certification
      }
      ... on WorkExperience {
        role
        organization
        employmentCategory {
          value
        }
        department {
          name {
            en
            fr
          }
        }
        cafForce {
          label {
            en
            fr
          }
        }
      }
    }
    skills {
      id
    }
  }
`);

const AwardPreviewListItem = ({
  experienceQuery,
  index,
  listLength,
}: ExperienceItemProps<FragmentType<typeof AwardExperienceItem_Fragment>>) => {
  const intl = useIntl();
  const experience = getFragment(AwardExperienceItem_Fragment, experienceQuery);

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
        <AwardExperienceDialog
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
      <p>{experience.issuedBy}</p>
    </PreviewList.Item>
  );
};

export default AwardPreviewListItem;
