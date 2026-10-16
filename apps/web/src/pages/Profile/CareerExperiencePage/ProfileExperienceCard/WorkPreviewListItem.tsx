import { useIntl } from "react-intl";

import {
  EmploymentCategory,
  getFragment,
  GovEmployeeType,
  GovPositionType,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { PreviewList } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";

import { useExperienceInfo } from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";

import type { ExperienceItemProps } from "./types";

export const WorkExperienceItem_Fragment = graphql(/* GraphQL */ `
  fragment WorkExperienceItem on WorkExperience {
    id
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
    cafRank {
      label {
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
    govPositionType {
      value
    }
    govEmploymentType {
      value
      label {
        en
        fr
      }
    }
    classification {
      group
      level
    }
    startDate
    endDate
    skills {
      id
    }
  }
`);

const WorkPreviewListItem = ({
  experienceQuery,
  index,
  listLength,
}: ExperienceItemProps<FragmentType<typeof WorkExperienceItem_Fragment>>) => {
  const intl = useIntl();
  const experience = getFragment(WorkExperienceItem_Fragment, experienceQuery);
  const { typeMessage, date } = useExperienceInfo(experience);

  const isGovExperience =
    experience.employmentCategory?.value ===
    EmploymentCategory.GovernmentOfCanada;
  const isStudent =
    experience.govEmploymentType?.value === GovEmployeeType.Student;
  const isActing =
    isGovExperience &&
    experience.govPositionType?.value === GovPositionType.Acting;

  const classification =
    experience.classification?.group && experience.classification?.level
      ? experience.classification?.group +
        "-" +
        (experience.classification?.level < 10 ? "0" : "") +
        experience.classification?.level
      : intl.formatMessage(commonMessages.notAvailable);

  const title =
    (isActing
      ? intl.formatMessage({
          defaultMessage: "Acting",
          id: "DylhBF",
          description: "Text when government position is acting",
        }) + " "
      : "") +
    (isGovExperience && !isStudent
      ? classification + intl.formatMessage(commonMessages.dividingColon)
      : "") +
    experience.role;

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
          label={intl.formatMessage(experienceMessages.showDetails, {
            experienceName: title,
          })}
          onClick={() => {
            // Display relevant dialog
          }}
        />
      }
      mode="experience"
      index={index}
      groupLength={listLength}
    >
      {isGovExperience && (
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "{position} with {department}, Government of Canada",
              id: "3EA8GO",
              description:
                "Text about an experience with the government of Canada",
            },
            {
              position: getLocalizedName(
                experience.govEmploymentType?.label,
                intl,
              ),
              department: experience.organization,
            },
          )}
        </p>
      )}
      {experience.employmentCategory?.value ===
        EmploymentCategory.CanadianArmedForces && (
        <p>
          {intl.formatMessage(experienceMessages.workWith, {
            role: getLocalizedName(experience.cafRank?.label, intl),
            group: getLocalizedName(experience.cafForce?.label, intl),
          })}
        </p>
      )}
    </PreviewList.Item>
  );
};

export default WorkPreviewListItem;
