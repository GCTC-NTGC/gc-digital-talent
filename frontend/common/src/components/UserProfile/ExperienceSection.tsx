import * as React from "react";
import { useIntl } from "react-intl";
import ExperienceAccordion, {
  ExperiencePaths,
} from "./ExperienceAccordion/ExperienceAccordion";
import SkillAccordion from "./SkillAccordion/SkillAccordion";
import { Tab, TabSet } from "../tabs";
import { getLocale } from "../../helpers/localize";
import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "../../types/ExperienceUtils";
import { AwardExperience, Experience, Skill } from "../../api/generated";
import ExperienceByTypeListing from "./ExperienceByTypeListing";

export interface ExperienceSectionProps {
  experiences?: Experience[];
  experienceEditPaths?: ExperiencePaths; // If experienceEditPaths is not defined, links to edit experiences will not appear.
}

const ExperienceSection: React.FunctionComponent<ExperienceSectionProps> = ({
  experiences,
  experienceEditPaths,
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
            <ExperienceAccordion
              key={experience.id}
              experience={experience}
              editPaths={experienceEditPaths}
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
        <ExperienceByTypeListing experiences={experiences} />
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
