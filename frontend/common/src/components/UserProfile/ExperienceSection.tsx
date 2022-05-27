import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import ExperienceAccordion from "./ExperienceAccordion/ExperienceAccordion";
import SkillAccordion from "./SkillAccordion/SkillAccordion";
import { Tab, TabSet } from "../tabs";
import { getLocale } from "../../helpers/localize";
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
  EducationExperience,
} from "../../api/generated";

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
export interface ExperienceSectionProps {
  experiences?: Experience[];
}

const ExperienceSection: React.FunctionComponent<ExperienceSectionProps> = ({
  experiences,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const awardExperiences =
    experiences
      ?.filter(isAwardExperience)
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
    experiences?.filter(isCommunityExperience).sort(compareByDate) || [];
  const educationExperiences =
    experiences?.filter(isEducationExperience).sort(compareByDate) || [];
  const personalExperiences =
    experiences?.filter(isPersonalExperience).sort(compareByDate) || [];
  const workExperiences =
    experiences?.filter(isWorkExperience).sort(compareByDate) || [];

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
            <ExperienceAccordion key={experience.id} experience={experience} />
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
  );
};

export default ExperienceSection;
