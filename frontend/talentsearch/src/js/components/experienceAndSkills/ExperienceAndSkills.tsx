import React from "react";
import { useSearchParams } from "react-router-dom";
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
import MissingSkills from "@common/components/MissingSkills";
import Well from "@common/components/Well";
import { notEmpty } from "@common/helpers/util";
import { navigationMessages } from "@common/messages";
import { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { flattenExperienceSkills } from "@common/types/ExperienceUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";

import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  PoolAdvertisement,
  Skill,
  WorkExperience,
} from "../../api/generated";
import useRoutes from "../../hooks/useRoutes";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import { ExperienceType } from "../experienceForm/types";

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
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const applicationParam = applicationId
    ? `?applicationId=${applicationId}`
    : ``;

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
      href: `${paths.createWork(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Work",
        id: "RF51Bp",
        description: "Title for work experience form button.",
      }),
      icon: BriefcaseIcon,
    },
    {
      href: `${paths.createEducation(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Education",
        id: "JUk80l",
        description: "Title for education experience form button.",
      }),
      icon: BookOpenIcon,
    },
    {
      href: `${paths.createCommunity(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Community",
        id: "mrhpJS",
        description: "Title for community experience form button.",
      }),
      icon: UserGroupIcon,
    },
    {
      href: `${paths.createPersonal(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Personal",
        id: "nuP1BG",
        description: "Title for personal experience form button.",
      }),
      icon: LightBulbIcon,
    },
    {
      href: `${paths.createAward(applicantId)}${applicationParam}`,
      title: intl.formatMessage({
        defaultMessage: "Award",
        id: "XF4Ok2",
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
        id: "PF2m1d",
        description:
          "Breadcrumb for experience and skills page in applicant profile.",
      }),
    },
  ] as BreadcrumbsProps["links"];

  if (poolAdvertisement) {
    crumbs = [
      {
        title: intl.formatMessage({
          defaultMessage: "My Applications",
          id: "q04FCp",
          description: "Link text for breadcrumb to user applications page.",
        }),
        href: paths.applications(applicantId),
      },
      {
        title: getFullPoolAdvertisementTitle(intl, poolAdvertisement),
        href: paths.pool(poolAdvertisement.id),
      },
      {
        href: paths.reviewApplication(applicantId),
        title: intl.formatMessage(navigationMessages.stepOne),
      },
      ...crumbs,
    ];
  }

  const returnRoute = applicationId
    ? paths.reviewApplication(applicationId)
    : paths.profile(applicantId);

  return (
    <ProfileFormWrapper
      prefixBreadcrumbs={!poolAdvertisement}
      crumbs={crumbs}
      description={intl.formatMessage({
        defaultMessage:
          "Here is where you can add experiences and skills to your profile. This could be anything from helping community members troubleshoot their computers to full-time employment at an IT organization.",
        id: "GAjpqU",
        description:
          "Description for the experience and skills page in applicant profile.",
      })}
      title={intl.formatMessage({
        defaultMessage: "My experience and skills",
        id: "KE49r9",
        description:
          "Heading for experience and skills page in applicant profile.",
      })}
      cancelLink={{
        href: returnRoute,
        children: intl.formatMessage(
          applicationId
            ? navigationMessages.backToApplication
            : navigationMessages.backToProfile,
        ),
      }}
    >
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
      <div data-h2-margin="base(x2, 0)">
        <div data-h2-flex-grid="base(flex-start, x.5)">
          <div data-h2-flex-item="base(1of1)">
            <p
              data-h2-text-decoration="base(none)"
              data-h2-font-weight="base(700)"
              data-h2-text-transform="base(uppercase)"
            >
              {intl.formatMessage({
                defaultMessage: "Add new experience:",
                id: "Tr5Pga",
                description:
                  "Message to user when no experiences have been attached to profile",
              })}
            </p>
          </div>
          <div data-h2-flex-item="base(1of1)">
            <div data-h2-flex-grid="base(center,x1) p-tablet(center, x.5)">
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
                        id: "XiUgMy",
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
      {!hasExperiences ? (
        <Well>
          <p data-h2-font-style="base(italic)">
            {intl.formatMessage({
              defaultMessage:
                "There are no experiences on your profile yet. You can add some using the preceding buttons.",
              id: "XzUzZz",
              description:
                "Message to user when no experiences have been attached to profile.",
            })}
          </p>
        </Well>
      ) : (
        <ExperienceSection
          experiences={experiences}
          experienceEditPaths={experienceEditPaths}
        />
      )}
      <ProfileFormFooter
        mode="cancelButton"
        cancelLink={{
          href: returnRoute,
          children: intl.formatMessage(
            applicationId
              ? navigationMessages.backToApplication
              : navigationMessages.backToProfile,
          ),
        }}
      />
    </ProfileFormWrapper>
  );
};

export default ExperienceAndSkills;
