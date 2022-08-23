import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { EducationExperience } from "@common/api/generated";
import { commonMessages } from "@common/messages";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { IconLink } from "@common/components/Link";
import {
  AwardExperience,
  CommunityExperience,
  Experience,
  PersonalExperience,
  WorkExperience,
  useGetAllApplicantExperiencesQuery,
  useGetMeQuery,
} from "../../api/generated";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileFormWrapper from "./ProfileFormWrapper";
import profileMessages from "../profile/profileMessages";

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
export interface ExperienceAndSkillsProps {
  applicantId: string;
  experiences?: Experience[];
}

export const ExperienceAndSkills: React.FunctionComponent<
  ExperienceAndSkillsProps
> = ({ applicantId, experiences }) => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();
  const experienceEditPaths = {
    awardUrl: (id: string) => paths.editExperience(applicantId, "award", id),
    communityUrl: (id: string) =>
      paths.editExperience(applicantId, "community", id),
    educationUrl: (id: string) =>
      paths.editExperience(applicantId, "education", id),
    personalUrl: (id: string) =>
      paths.editExperience(applicantId, "personal", id),
    workUrl: (id: string) => paths.editExperience(applicantId, "work", id),
  };

  const links = [
    {
      href: paths.createPersonal(applicantId),
      title: intl.formatMessage({
        defaultMessage: "Personal",
        description: "Title for personal experience form button.",
      }),
      icon: LightBulbIcon,
    },
    {
      href: paths.createCommunity(applicantId),
      title: intl.formatMessage({
        defaultMessage: "Community",
        description: "Title for community experience form button.",
      }),
      icon: UserGroupIcon,
    },
    {
      href: paths.createWork(applicantId),
      title: intl.formatMessage({
        defaultMessage: "Work",
        description: "Title for work experience form button.",
      }),
      icon: BriefcaseIcon,
    },
    {
      href: paths.createEducation(applicantId),
      title: intl.formatMessage({
        defaultMessage: "Education",
        description: "Title for education experience form button.",
      }),
      icon: BookOpenIcon,
    },
    {
      href: paths.createAward(applicantId),
      title: intl.formatMessage({
        defaultMessage: "Award",
        description: "Title for award experience form button.",
      }),
      icon: StarIcon,
    },
  ];

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
      {!experiences || experiences?.length === 0 ? (
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

export const ExperienceAndSkillsApi: React.FunctionComponent<{
  applicantId: string;
}> = ({ applicantId }) => {
  const intl = useIntl();
  const [{ data: applicantData, fetching, error }] =
    useGetAllApplicantExperiencesQuery({ variables: { id: applicantId } });

  return (
    <Pending fetching={fetching} error={error}>
      {applicantData?.applicant ? (
        <ExperienceAndSkills
          applicantId={applicantId}
          experiences={applicantData.applicant.experiences?.filter(notEmpty)}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "User {applicantId} not found.",
                description: "Message displayed for user not found.",
              },
              { applicantId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

// This should probably be removed now
const ExperienceAndSkillsRouterApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetMeQuery();
  const { data, fetching, error } = result;

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ExperienceAndSkillsApi applicantId={data.me.id} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ExperienceAndSkillsRouterApi;
