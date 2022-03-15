import { CommunityExperience } from "@common/api/generated";
import { Tab, TabSet } from "@common/components/tabs";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import {
  AwardExperience,
  EducationExperience,
  Experience,
  PersonalExperience,
  useGetApplicantExperiencesByTypeQuery,
  WorkExperience,
} from "../../api/generated";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileFormWrapper from "./ProfileFormWrapper";

export interface ExperienceAndSkillsProps {
  awardExperiences: Omit<AwardExperience, "applicant">[];
  communityExperiences: Omit<CommunityExperience, "applicant">[];
  educationExperiences: Omit<EducationExperience, "applicant">[];
  personalExperience: Omit<PersonalExperience, "applicant">[];
  workExperience: Omit<WorkExperience, "applicant">[];
}

const ExperienceAndSkills: React.FunctionComponent<
  ExperienceAndSkillsProps
> = ({
  awardExperiences,
  communityExperiences,
  educationExperiences,
  personalExperience,
  workExperience,
}) => {
  const intl = useIntl();
  const links = [
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Personal",
        description: "Title for personal experience form button.",
      }),
      icon: <LightBulbIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Community",
        description: "Title for community experience form button.",
      }),
      icon: <UserGroupIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Work",
        description: "Title for work experience form button.",
      }),
      icon: <BriefcaseIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Education",
        description: "Title for education experience form button.",
      }),
      icon: <BookOpenIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Award",
        description: "Title for award experience form button.",
      }),
      icon: <StarIcon style={{ width: "1rem" }} />,
    },
  ];

  const allExperiences: Omit<Experience, "applicant">[] = [
    ...awardExperiences,
    ...communityExperiences,
    ...educationExperiences,
    ...personalExperience,
    ...workExperience,
  ];

  const sortedByType = allExperiences.sort(); // TODO: Sort by type
  const sortedByDate = allExperiences.sort(); // TODO: Sort by date
  const sortedBySkills = allExperiences.sort(); // TODO: Sort by Skills

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
        defaultMessage: "Experience and Skills",
        description:
          "Heading for experience and skills page in applicant profile.",
      })}
    >
      <div data-h2-display="b(flex)" data-h2-align-items="b(center)">
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
          data-h2-margin="b(top-bottom, m) b(left, m)"
          data-h2-padding="b(all, m)"
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between)"
          data-h2-radius="b(s)"
          data-h2-bg-color="b(lightgray)"
          style={{ flexGrow: "2" }}
        >
          {links.map(({ title, href, icon }) => (
            <a key={title} href={href} title={title} data-h2-display="b(flex)">
              {icon}
              <span data-h2-padding="b(left, xxs) b(top-bottom, xs) b(right, xs)">
                {title}
              </span>
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
              data-h2-padding="b(all, m)"
            >
              {sortedByDate.map(({ id }) => (
                <div key={id}>Replace with Accordion</div>
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
            <div
              data-h2-radius="b(s)"
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, m)"
            >
              {sortedByType.map(({ id }) => (
                <div key={id}>Replace with Accordion</div>
              ))}
            </div>
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
              data-h2-padding="b(all, m)"
            >
              {sortedBySkills.map(({ id }) => (
                <div key={id}>Replace with Accordion</div>
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
    useGetApplicantExperiencesByTypeQuery({ variables: { id: applicantId } });
  const { applicant } = applicantData ?? { applicant: null }; // TODO: This shorthand might be wrong...

  const awardExperiences = applicant?.awardExperiences?.filter(notEmpty) ?? [];
  const communityExperiences =
    applicant?.communityExperiences?.filter(notEmpty) ?? [];
  const educationExperiences =
    applicant?.educationExperiences?.filter(notEmpty) ?? [];
  const personalExperiences =
    applicant?.personalExperiences?.filter(notEmpty) ?? [];
  const workExperiences = applicant?.workExperiences?.filter(notEmpty) ?? [];

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
      awardExperiences={awardExperiences}
      communityExperiences={communityExperiences}
      educationExperiences={educationExperiences}
      personalExperience={personalExperiences}
      workExperience={workExperiences}
    />
  ) : (
    <p>
      {intl.formatMessage(
        {
          defaultMessage: "User {userId} not found.",
          description: "Message displayed for user not found.",
        },
        { applicantId },
      )}
    </p>
  );
};
