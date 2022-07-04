import * as React from "react";
import { useIntl } from "react-intl";
import ExperienceAccordion, {
  ExperiencePaths,
} from "./ExperienceAccordion/ExperienceAccordion";
import SkillAccordion from "./SkillAccordion/SkillAccordion";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../Tabs";
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
  editPath?: string;
}

const ExperienceSection: React.FunctionComponent<ExperienceSectionProps> = ({
  experiences,
  experienceEditPaths,
  editPath,
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

  let isExperience = false;
  if (allExperiences.length >= 1) {
    isExperience = true;
  }

  const tabs = [
    intl.formatMessage({
      defaultMessage: "By Date",
      description:
        "Tab title for experiences sorted by date in applicant profile.",
    }),
    intl.formatMessage({
      defaultMessage: "By Type",
      description:
        "Tab title for experiences sorted by type in applicant profile.",
    }),
    intl.formatMessage({
      defaultMessage: "By Skills",
      description:
        "Tab title for experiences sorted by skills in applicant profile.",
    }),
  ];

  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {isExperience && (
        <Tabs>
          <TabList>
            {tabs.map((tab, index) => (
              <Tab key={tab} index={index}>
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
              <ExperienceByTypeListing
                experiences={experiences}
                editPaths={experienceEditPaths}
              />
            </TabPanel>
            <TabPanel>
              <div
                data-h2-radius="b(s)"
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(top-bottom, xxs) b(right-left, xs)"
              >
                {sortedBySkills.map((skill) => (
                  <SkillAccordion key={skill.id} skill={skill} />
                ))}
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
      {!isExperience && !editPath && (
        <p>
          {intl.formatMessage({
            defaultMessage: "No information has been provided",
            description:
              "Message on Admin side when user not filled Experience section.",
          })}
        </p>
      )}
      {!isExperience && editPath && (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              description: "Message for when no data exists for the section",
            })}
          </p>
          <p>
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Click here to get started.",
                description: "Message to click on the words to begin something",
              })}
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default ExperienceSection;
