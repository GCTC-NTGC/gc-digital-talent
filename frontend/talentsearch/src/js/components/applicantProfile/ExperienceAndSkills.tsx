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
  experiences?: Experience[];
}

export const ExperienceAndSkills: React.FunctionComponent<
  ExperienceAndSkillsProps
> = ({ experiences }) => {
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
      icon: <LightBulbIcon style={{ width: "1.5rem" }} />,
    },
    {
      href: paths.createCommunity(),
      title: intl.formatMessage({
        defaultMessage: "Community",
        description: "Title for community experience form button.",
      }),
      icon: <UserGroupIcon style={{ width: "1.5rem" }} />,
    },
    {
      href: paths.createWork(),
      title: intl.formatMessage({
        defaultMessage: "Work",
        description: "Title for work experience form button.",
      }),
      icon: <BriefcaseIcon style={{ width: "1.5rem" }} />,
    },
    {
      href: paths.createEducation(),
      title: intl.formatMessage({
        defaultMessage: "Education",
        description: "Title for education experience form button.",
      }),
      icon: <BookOpenIcon style={{ width: "1.5rem" }} />,
    },
    {
      href: paths.createAward(),
      title: intl.formatMessage({
        defaultMessage: "Award",
        description: "Title for award experience form button.",
      }),
      icon: <StarIcon style={{ width: "1.5rem" }} />,
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
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-flex-direction="base(column) l-tablet(row)"
      >
        <p
          data-h2-font-style="base(reset)"
          data-h2-font-weight="base(700)"
          style={{ textTransform: "uppercase" }}
        >
          {intl.formatMessage({
            defaultMessage: "Add new experience:",
            description:
              "Message to user when no experiences have been attached to profile",
          })}
        </p>
        <div
          data-h2-margin="base(auto, auto, x1, auto) p-tablet(x1, auto, auto, x1)"
          data-h2-padding="base(x1)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-justify-content="base(center) l-tablet(space-between)"
          data-h2-radius="base(s)"
          data-h2-background-color="base(light.dt-gray)"
          style={{ flexGrow: "2" }}
        >
          {links.map(({ title, href, icon }) => (
            <a
              key={title}
              href={href}
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-margin="base(x.25, auto) l-tablet(0, auto)"
            >
              {icon}
              <span data-h2-padding="base(0, x.25, 0, x.125)">{title}</span>
            </a>
          ))}
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
                "There are no experiences on your profile yet. You can add some using the links above.",
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

      <ProfileFormFooter mode="cancelButton" />
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
