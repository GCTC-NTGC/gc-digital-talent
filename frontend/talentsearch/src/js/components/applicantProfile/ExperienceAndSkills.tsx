import { Tab, TabSet } from "@common/components/tabs";
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
import { getLocale } from "@common/helpers/localize";
import { commonMessages } from "@common/messages";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "../../types/ExperienceUtils";
import {
  AwardExperience,
  CommunityExperience,
  Experience,
  PersonalExperience,
  Skill,
  WorkExperience,
  useGetAllApplicantExperiencesQuery,
} from "../../api/generated";
import ExperienceAccordion from "../ExperienceAccordion/ExperienceAccordion";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileFormWrapper from "./ProfileFormWrapper";
import SkillAccordion from "../skills/SkillAccordion/SkillAccordion";

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
const ExperienceByType: React.FunctionComponent<{
  title: string;
  icon: React.ReactNode;
  experiences: Experience[];
}> = ({ title, icon, experiences }) => {
  return (
    <div>
      <div data-h2-display="b(flex)" data-h2-margin="b(top-bottom, m)">
        {icon}
        <p
          data-h2-font-size="b(h4)"
          data-h2-margin="b(all, none)"
          data-h2-padding="b(left, s)"
        >
          {title}
        </p>
      </div>
      <div
        data-h2-radius="b(s)"
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(top-bottom, xxs) b(right-left, xs)"
      >
        {experiences.map((experience) => (
          <ExperienceAccordion key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
};
export interface ExperienceAndSkillsProps {
  experiences?: Experience[];
}

const ExperienceAndSkills: React.FunctionComponent<ExperienceAndSkillsProps> =
  ({ experiences }) => {
    const intl = useIntl();
    const locale = getLocale(intl);

    const awardExperiences =
      experiences
        ?.filter((experience) => isAwardExperience(experience))
        .map(
          (award: AwardExperience) =>
            ({
              ...award,
              startDate: award.awardedDate,
              endDate: award.awardedDate,
            } as AwardExperience & { startDate: string; endDate: string }),
        )
        .sort(compareByDate) || [];
    const communityExperiences =
      experiences
        ?.filter((experience) => isCommunityExperience(experience))
        .sort(compareByDate) || [];
    const educationExperiences =
      experiences
        ?.filter((experience) => isEducationExperience(experience))
        .sort(compareByDate) || [];
    const personalExperiences =
      experiences
        ?.filter((experience) => isPersonalExperience(experience))
        .sort(compareByDate) || [];
    const workExperiences =
      experiences
        ?.filter((experience) => isWorkExperience(experience))
        .sort(compareByDate) || [];

    const links = [
      {
        href: "/",
        title: intl.formatMessage({
          defaultMessage: "Personal",
          description: "Title for personal experience form button.",
        }),
        icon: <LightBulbIcon style={{ width: "1.5rem" }} />,
      },
      {
        href: "/",
        title: intl.formatMessage({
          defaultMessage: "Community",
          description: "Title for community experience form button.",
        }),
        icon: <UserGroupIcon style={{ width: "1.5rem" }} />,
      },
      {
        href: "/",
        title: intl.formatMessage({
          defaultMessage: "Work",
          description: "Title for work experience form button.",
        }),
        icon: <BriefcaseIcon style={{ width: "1.5rem" }} />,
      },
      {
        href: "/",
        title: intl.formatMessage({
          defaultMessage: "Education",
          description: "Title for education experience form button.",
        }),
        icon: <BookOpenIcon style={{ width: "1.5rem" }} />,
      },
      {
        href: "/",
        title: intl.formatMessage({
          defaultMessage: "Award",
          description: "Title for award experience form button.",
        }),
        icon: <StarIcon style={{ width: "1.5rem" }} />,
      },
    ];

    const allExperiences = [
      ...awardExperiences,
      ...communityExperiences,
      ...educationExperiences,
      ...personalExperiences,
      ...workExperiences,
    ];

    const sortedByDate = allExperiences.sort(compareByDate);

    const allSkills: Skill[] =
      experiences?.reduce((accumulator: Skill[], currentValue: Experience) => {
        const skills = currentValue.skills || [];
        return [...accumulator, ...skills];
      }, []) || [];
    const skillIds = allSkills.map(({ id }) => id);
    const sortedBySkills = allSkills
      .filter(({ id }, index) => !skillIds.includes(id, index + 1)) // Remove duplicate skills
      .sort((skill1, skill2) => {
        const skill1Name: string = skill1.name[locale] || "";
        const skill2Name: string = skill2.name[locale] || "";
        return skill1Name.localeCompare(skill2Name);
      }); // Sort skills alphabetically

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
          data-h2-display="b(flex)"
          data-h2-align-items="b(center)"
          data-h2-flex-direction="b(column) m(row)"
        >
          <p
            data-h2-font-style="b(reset)"
            data-h2-font-weight="b(700)"
            style={{ textTransform: "uppercase" }}
          >
            {intl.formatMessage({
              defaultMessage: "Add new experience:",
              description:
                "Label before new experience buttons on experience and skills page.",
            })}
          </p>
          <div
            data-h2-margin="b(bottom, m) s(top, m) s(left, m)"
            data-h2-padding="b(all, m)"
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column) s(row)"
            data-h2-justify-content="b(center) m(space-between)"
            data-h2-radius="b(s)"
            data-h2-bg-color="b(lightgray)"
            style={{ flexGrow: "2" }}
          >
            {links.map(({ title, href, icon }) => (
              <a
                key={title}
                href={href}
                title={title}
                data-h2-display="b(flex)"
                data-h2-align-items="b(center)"
                data-h2-margin="b(top-bottom, xs) m(top-bottom, none)"
              >
                {icon}
                <span data-h2-padding="b(left, xxs) b(right, xs)">{title}</span>
              </a>
            ))}
          </div>
        </div>
        {allExperiences.length > 0 ? (
          <TabSet>
            <Tab
              tabType="label"
              text={intl.formatMessage({
                defaultMessage: "See Experience:",
                description:
                  "Tabs title for the users experience list in applicant profile.",
              })}
            />
            <Tab
              text={intl.formatMessage({
                defaultMessage: "By Date",
                description:
                  "Tab title for experiences sorted by date in applicant profile.",
              })}
            >
              <div
                data-h2-radius="b(s)"
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(top-bottom, xxs) b(right-left, xs)"
              >
                {sortedByDate.map((experience) => (
                  <ExperienceAccordion
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            </Tab>
            <Tab
              text={intl.formatMessage({
                defaultMessage: "By Type",
                description:
                  "Tab title for experiences sorted by type in applicant profile.",
              })}
            >
              <ExperienceByType
                title={intl.formatMessage({ defaultMessage: "Personal" })}
                icon={<LightBulbIcon style={{ width: "1.5rem" }} />}
                experiences={personalExperiences}
              />
              <ExperienceByType
                title={intl.formatMessage({ defaultMessage: "Community" })}
                icon={<UserGroupIcon style={{ width: "1.5rem" }} />}
                experiences={communityExperiences}
              />
              <ExperienceByType
                title={intl.formatMessage({ defaultMessage: "Work" })}
                icon={<BriefcaseIcon style={{ width: "1.5rem" }} />}
                experiences={workExperiences}
              />
              <ExperienceByType
                title={intl.formatMessage({ defaultMessage: "Education" })}
                icon={<BookOpenIcon style={{ width: "1.5rem" }} />}
                experiences={educationExperiences}
              />
              <ExperienceByType
                title={intl.formatMessage({ defaultMessage: "Award" })}
                icon={<StarIcon style={{ width: "1.5rem" }} />}
                experiences={awardExperiences}
              />
            </Tab>
            <Tab
              text={intl.formatMessage({
                defaultMessage: "By Skills",
                description:
                  "Tab title for experiences sorted by skills in applicant profile.",
              })}
            >
              <div
                data-h2-radius="b(s)"
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(top-bottom, xxs) b(right-left, xs)"
              >
                {sortedBySkills.map((skill) => (
                  <SkillAccordion key={skill.id} skill={skill} />
                ))}
              </div>
            </Tab>
          </TabSet>
        ) : (
          <div
            data-h2-radius="b(s)"
            data-h2-bg-color="b(lightgray)"
            data-h2-padding="b(all, m)"
          >
            <p data-h2-font-style="b(italic)">
              {intl.formatMessage({
                defaultMessage:
                  "There are no experiences on your profile yet. You can add some using the links above.",
                description:
                  "Message to user when no experiences have been attached to profile.",
              })}
            </p>
          </div>
        )}
        <ProfileFormFooter mode="cancelButton" />
      </ProfileFormWrapper>
    );
  };

export default ExperienceAndSkills;

export const ExperienceAndSkillsApi: React.FunctionComponent<{
  applicantId: string;
}> = ({ applicantId }) => {
  const intl = useIntl();
  const [{ data: applicantData, fetching, error }] =
    useGetAllApplicantExperiencesQuery({ variables: { id: applicantId } });

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );
  return applicantData?.applicant ? (
    <ExperienceAndSkills
      experiences={applicantData.applicant.experiences?.filter(notEmpty)}
    />
  ) : (
    <p>
      {intl.formatMessage(
        {
          defaultMessage: "User {applicantId} not found.",
          description: "Message displayed for user not found.",
        },
        { applicantId },
      )}
    </p>
  );
};
