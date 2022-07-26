import * as React from "react";
import { useIntl } from "react-intl";
import { invertSkillExperienceTree } from "../../helpers/skillUtils";
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
import { AwardExperience, Experience } from "../../api/generated";
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

  const awardExperiences = React.useMemo(
    () =>
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
        .sort(compareByDate) || [],
    [experiences],
  );

  const communityExperiences = React.useMemo(
    () => experiences?.filter(isCommunityExperience).sort(compareByDate) || [],
    [experiences],
  );

  const educationExperiences = React.useMemo(
    () => experiences?.filter(isEducationExperience).sort(compareByDate) || [],
    [experiences],
  );

  const personalExperiences = React.useMemo(
    () => experiences?.filter(isPersonalExperience).sort(compareByDate) || [],
    [experiences],
  );

  const workExperiences = React.useMemo(
    () => experiences?.filter(isWorkExperience).sort(compareByDate) || [],
    [experiences],
  );

  const allExperiences = React.useMemo(
    () => [
      ...awardExperiences,
      ...communityExperiences,
      ...educationExperiences,
      ...personalExperiences,
      ...workExperiences,
    ],
    [
      awardExperiences,
      communityExperiences,
      educationExperiences,
      personalExperiences,
      workExperiences,
    ],
  );

  const sortedByDate = allExperiences.sort(compareByDate);

  const allSkills = React.useMemo(
    () => invertSkillExperienceTree(allExperiences),
    [allExperiences],
  );
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

  return isExperience ? (
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
          {sortedByDate.map((experience) => (
            <ExperienceAccordion
              key={experience.id}
              experience={experience}
              editPaths={experienceEditPaths}
            />
          ))}
        </TabPanel>
        <TabPanel>
          <ExperienceByTypeListing
            experiences={experiences}
            editPaths={experienceEditPaths}
          />
        </TabPanel>
        <TabPanel>
          {sortedBySkills.map((skill) => (
            <SkillAccordion key={skill.id} skill={skill} />
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  ) : (
    <div
      data-h2-background-color="base(dt-gray.light)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      {!editPath ? (
        <p>
          {intl.formatMessage({
            defaultMessage: "No information has been provided",
            description:
              "Message on Admin side when user not filled Experience section.",
          })}
        </p>
      ) : (
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
                defaultMessage: "Edit your experience options.",
                description:
                  "Link text to edit experience information on profile.",
              })}
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default ExperienceSection;
