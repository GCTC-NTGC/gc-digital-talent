import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { PreviewList } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import { useExperienceInfo } from "~/utils/experienceUtils";

import type { ExperienceItemProps } from "./types";

export const EducationExperienceItem_Fragment = graphql(/* GraphQL */ `
  fragment EducationExperienceItem on EducationExperience {
    id
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
    startDate
    endDate
    prospectiveEndDate
    skills {
      id
    }
  }
`);

const EducationPreviewListItem = ({
  experienceQuery,
  index,
  listLength,
}: ExperienceItemProps<
  FragmentType<typeof EducationExperienceItem_Fragment>
>) => {
  const intl = useIntl();
  const experience = getFragment(
    EducationExperienceItem_Fragment,
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
        <PreviewList.Button
          label={title}
          onClick={() => {
            // Display relevant dialog
          }}
        />
      }
      mode="experience"
      index={index}
      groupLength={listLength}
    ></PreviewList.Item>
  );
};

export default EducationPreviewListItem;
