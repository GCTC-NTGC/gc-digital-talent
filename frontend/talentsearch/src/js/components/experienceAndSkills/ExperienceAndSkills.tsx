import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import { EducationExperience, Scalars } from "@common/api/generated";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { IconLink } from "@common/components/Link";
import { notEmpty, flatten } from "@common/helpers/util";
import MissingSkills from "@common/components/skills/MissingSkills";
import { commonMessages } from "@common/messages";
import {
  AwardExperience,
  CommunityExperience,
  Experience,
  PersonalExperience,
  Skill,
  WorkExperience,
} from "../../api/generated";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";

type MergedExperiences = Array<
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience
>;

export type ExperienceForDate =
  | (AwardExperience & { startDate: string; endDate: string })
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export const compareByDate = (e1: ExperienceForDate, e2: ExperienceForDate) => {
  const e1EndDate = e1.endDate ? new Date(e1.endDate).getTime() : null;
  const e2EndDate = e2.endDate ? new Date(e2.endDate).getTime() : null;
  const e1StartDate = e1.startDate ? new Date(e1.startDate).getTime() : -1;
  const e2StartDate = e2.startDate ? new Date(e2.startDate).getTime() : -1;

  // All items with no end date should be at the top and sorted by most recent start date.
  if (!e1EndDate && !e2EndDate) {
    return e2StartDate - e1StartDate;
  }

  if (!e1EndDate) {
    return -1;
  }

  if (!e2EndDate) {
    return 1;
  }

  // Items with end date should be sorted by most recent end date at top.
  return e2EndDate - e1EndDate;
};

const flattenExperienceSkills = (experiences: MergedExperiences): Skill[] => {
  const skillSkills = experiences
    .map((experience) => {
      const { skills } = experience;
      return skills?.filter(notEmpty);
    })
    .filter(notEmpty);

  return flatten(skillSkills);
};

export interface ExperienceAndSkillsProps {
  experiences?: Experience[];
  applicationId?: Scalars["ID"];
  missingSkills?: {
    requiredSkills: Skill[];
    optionalSkills: Skill[];
  };
}

export const ExperienceAndSkills: React.FunctionComponent<
  ExperienceAndSkillsProps
> = ({ experiences, missingSkills, applicationId }) => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();
  const experienceEditPaths = {
    awardUrl: (id: string) => paths.editExperience("award", id),
    communityUrl: (id: string) => paths.editExperience("community", id),
    educationUrl: (id: string) => paths.editExperience("education", id),
    personalUrl: (id: string) => paths.editExperience("personal", id),
    workUrl: (id: string) => paths.editExperience("work", id),
  };

  const links = [
    {
      href: paths.createPersonal(),
      title: intl.formatMessage({
        defaultMessage: "Personal",
        description: "Title for personal experience form button.",
      }),
      icon: LightBulbIcon,
    },
    {
      href: paths.createCommunity(),
      title: intl.formatMessage({
        defaultMessage: "Community",
        description: "Title for community experience form button.",
      }),
      icon: UserGroupIcon,
    },
    {
      href: paths.createWork(),
      title: intl.formatMessage({
        defaultMessage: "Work",
        description: "Title for work experience form button.",
      }),
      icon: BriefcaseIcon,
    },
    {
      href: paths.createEducation(),
      title: intl.formatMessage({
        defaultMessage: "Education",
        description: "Title for education experience form button.",
      }),
      icon: BookOpenIcon,
    },
    {
      href: paths.createAward(),
      title: intl.formatMessage({
        defaultMessage: "Award",
        description: "Title for award experience form button.",
      }),
      icon: StarIcon,
    },
  ];

  const hasExperiences = notEmpty(experiences);

  return (
    <ProfileFormWrapper
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Experience and Skills",
            description:
              "Breadcrumb for experience and skills page in applicant profile.",
          }),
        },
      ]}
      description={intl.formatMessage({
        defaultMessage:
          "Here is where you can add experiences and skills to your profile. This could be anything from helping community members troubleshoot their computers to full-time employment at an IT organization.",
        description:
          "Description for the experience and skills page in applicant profile.",
      })}
      title={intl.formatMessage({
        defaultMessage: "My experience and skills",
        description:
          "Heading for experience and skills page in applicant profile.",
      })}
      cancelLink={{
        children: intl.formatMessage(commonMessages.backToProfile),
      }}
    >
      <p
        data-h2-font-style="b(reset)"
        data-h2-font-weight="b(700)"
        data-h2-margin="b(bottom, xxs)"
        style={{ textTransform: "uppercase" }}
      >
        {intl.formatMessage({
          defaultMessage: "Add new experience:",
          description:
            "Message to user when no experiences have been attached to profile",
        })}
      </p>
      <div
        data-h2-margin="b(bottom, m)"
        data-h2-flex-grid="b(normal, contained, flush, xs)"
        style={{ flexGrow: "2" }}
      >
        {links.map(({ title, href, icon }) => (
          <div data-h2-flex-item="b(1of1) s(1of5)" key={title}>
            <IconLink
              href={href}
              type="button"
              color="primary"
              icon={icon}
              block
            >
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<hidden>Add new </hidden>{title}<hidden> experience</hidden>",
                  description:
                    "Link text for adding a new experience of a specific type.",
                },
                { title },
              )}
            </IconLink>
          </div>
        ))}
      </div>
      {missingSkills && (
        <div data-h2-margin="b(top-bottom, s)">
          <MissingSkills
            addedSkills={
              hasExperiences ? flattenExperienceSkills(experiences) : []
            }
            requiredSkills={missingSkills.requiredSkills}
            optionalSkills={missingSkills.optionalSkills}
          />
        </div>
      )}
      {!hasExperiences ? (
        <div
          data-h2-radius="b(s)"
          data-h2-bg-color="b(lightgray)"
          data-h2-padding="b(all, m)"
        >
          <p data-h2-font-style="b(italic)">
            {intl.formatMessage({
              defaultMessage:
                "There are no experiences on your profile yet. You can add some using the preceding buttons.",
              description:
                "Message to user when no experiences have been attached to profile.",
            })}
          </p>
        </div>
      ) : (
        <ExperienceSection
          experiences={experiences}
          experienceEditPaths={experienceEditPaths}
        />
      )}
      <ProfileFormFooter
        mode="cancelButton"
        cancelLink={{
          children: intl.formatMessage(commonMessages.backToProfile),
        }}
      />
    </ProfileFormWrapper>
  );
};

export default ExperienceAndSkills;
