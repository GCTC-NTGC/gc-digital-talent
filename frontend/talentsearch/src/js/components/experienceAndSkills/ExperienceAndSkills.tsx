import React from "react";
import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useIntl } from "react-intl";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { IconLink } from "@common/components/Link";
import { notEmpty } from "@common/helpers/util";
import MissingSkills from "@common/components/skills/MissingSkills";
import { commonMessages } from "@common/messages";
import { useQueryParams } from "@common/helpers/router";
import { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  PoolAdvertisement,
  Skill,
  WorkExperience,
} from "../../api/generated";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import { ExperienceType } from "../experienceForm/types";
import getFullPoolAdvertisementTitle from "../pool/getFullPoolAdvertisementTitle";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

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
  return experiences
    .map((experience) => {
      const { skills } = experience;
      return skills?.filter(notEmpty);
    })
    .filter(notEmpty)
    .flatMap((skill) => skill);
};

export interface ExperienceAndSkillsProps {
  applicantId: string;
  experiences?: MergedExperiences;
  poolAdvertisement?: PoolAdvertisement;
  missingSkills?: {
    requiredSkills: Skill[];
    optionalSkills: Skill[];
  };
}

export const ExperienceAndSkills: React.FunctionComponent<
  ExperienceAndSkillsProps
> = ({ experiences, missingSkills, applicantId, poolAdvertisement }) => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();
  const directIntakePaths = useDirectIntakeRoutes();
  const { application } = useQueryParams();
  const applicationParam = application ? `?application=${application}` : ``;

  const getEditPath = (id: string, type: ExperienceType) => {
    return `${paths.editExperience(applicantId, type, id)}${applicationParam}`;
  };

  const experienceEditPaths = {
    awardUrl: (id: string) => getEditPath(id, "award"),
    communityUrl: (id: string) => getEditPath(id, "community"),
    educationUrl: (id: string) => getEditPath(id, "education"),
    personalUrl: (id: string) => getEditPath(id, "personal"),
    workUrl: (id: string) => getEditPath(id, "work"),
  };

  const links = [
    {
      href: `${paths.createPersonal(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Personal",
        description: "Title for personal experience form button.",
      }),
      icon: LightBulbIcon,
    },
    {
      href: `${paths.createCommunity(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Community",
        description: "Title for community experience form button.",
      }),
      icon: UserGroupIcon,
    },
    {
      href: `${paths.createWork(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Work",
        description: "Title for work experience form button.",
      }),
      icon: BriefcaseIcon,
    },
    {
      href: `${paths.createEducation(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Education",
        description: "Title for education experience form button.",
      }),
      icon: BookOpenIcon,
    },
    {
      href: `${paths.createAward(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Award",
        description: "Title for award experience form button.",
      }),
      icon: StarIcon,
    },
  ];

  const hasExperiences = notEmpty(experiences);

  let crumbs = [
    {
      title: intl.formatMessage({
        defaultMessage: "Experience and Skills",
        description:
          "Breadcrumb for experience and skills page in applicant profile.",
      }),
    },
  ] as BreadcrumbsProps["links"];

  if (poolAdvertisement) {
    const advertisementTitle = getFullPoolAdvertisementTitle(
      intl,
      poolAdvertisement,
    );

    crumbs = [
      {
        title: intl.formatMessage({
          defaultMessage: "My Applications",
          description: "Link text for breadcrumb to user applications page.",
        }),
        href: directIntakePaths.applications(applicantId),
      },
      {
        title: advertisementTitle,
        href: "/#",
      },
      ...crumbs,
    ];
  }

  return (
    <ProfileFormWrapper
      prefixBreadcrumbs={!poolAdvertisement}
      crumbs={crumbs}
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
      <div data-h2-margin="base(x2, 0)">
        <div data-h2-flex-grid="base(flex-start, 0, x.5)">
          <div data-h2-flex-item="base(1of1)">
            <p
              data-h2-font-style="base(reset)"
              data-h2-font-weight="base(700)"
              data-h2-text-transform="base(uppercase)"
            >
              {intl.formatMessage({
                defaultMessage: "Add new experience:",
                description:
                  "Message to user when no experiences have been attached to profile",
              })}
            </p>
          </div>
          <div data-h2-flex-item="base(1of1)">
            <div data-h2-flex-grid="base(center, 0, x1) p-tablet(center, 0, x.5)">
              {links.map(({ title, href, icon }) => (
                <div key={title} data-h2-flex-item="base(1of1) p-tablet(1of5)">
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
          </div>
        </div>
      </div>
      {missingSkills && (
        <div data-h2-margin="base(x1, 0)">
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
          data-h2-radius="base(s)"
          data-h2-background-color="base(light.dt-gray)"
          data-h2-padding="base(x1)"
        >
          <p data-h2-font-style="base(italic)">
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
