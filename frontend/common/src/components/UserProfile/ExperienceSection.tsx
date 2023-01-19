import * as React from "react";
import { useIntl } from "react-intl";
import Accordion from "../Accordion";
import Tabs from "../Tabs";
import { invertSkillExperienceTree } from "../../helpers/skillUtils";
import ExperienceAccordion, {
  ExperiencePaths,
} from "./ExperienceAccordion/ExperienceAccordion";
import SkillAccordion from "./SkillAccordion/SkillAccordion";
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
import { HeadingLevel } from "../Heading";

export interface ExperienceSectionProps {
  experiences?: Experience[];
  experienceEditPaths?: ExperiencePaths; //  If experienceEditPaths is not defined, links to edit experiences will not appear.
  editPath?: string;
  headingLevel?: HeadingLevel;
}

const ExperienceSection: React.FunctionComponent<ExperienceSectionProps> = ({
  experiences,
  experienceEditPaths,
  editPath,
  headingLevel = "h3",
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
    .filter(({ id }, index) => !skillIds.includes(id, index + 1)) //  Remove duplicate skills
    .sort((skill1, skill2) => {
      const skill1Name: string = skill1.name[locale] || "";
      const skill2Name: string = skill2.name[locale] || "";
      return skill1Name.localeCompare(skill2Name);
    }); //  Sort skills alphabetically

  let isExperience = false;
  if (allExperiences.length >= 1) {
    isExperience = true;
  }

  const tabs = [
    intl.formatMessage({
      defaultMessage: "By Date",
      id: "w+L6oa",
      description:
        "Tab title for experiences sorted by date in applicant profile.",
    }),
    intl.formatMessage({
      defaultMessage: "By Type",
      id: "P/tHlt",
      description:
        "Tab title for experiences sorted by type in applicant profile.",
    }),
    intl.formatMessage({
      defaultMessage: "By Skills",
      id: "JerysR",
      description:
        "Tab title for experiences sorted by skills in applicant profile.",
    }),
  ];

  return isExperience ? (
    <Tabs.Root defaultValue="0">
      <Tabs.List>
        {tabs.map((tab, index) => (
          <Tabs.Trigger key={tab} value={`${index}`}>
            {tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content value="0">
        <Accordion.Root type="single" collapsible>
          {sortedByDate.map((experience) => (
            <ExperienceAccordion
              headingLevel={headingLevel}
              key={experience.id}
              experience={experience}
              editPaths={experienceEditPaths}
            />
          ))}
        </Accordion.Root>
      </Tabs.Content>
      <Tabs.Content value="1">
        <ExperienceByTypeListing
          headingLevel={headingLevel}
          experiences={experiences}
          editPaths={experienceEditPaths}
        />
      </Tabs.Content>
      <Tabs.Content value="2">
        <Accordion.Root type="multiple">
          {sortedBySkills.map((skill) => (
            <SkillAccordion
              key={skill.id}
              skill={skill}
              headingLevel={headingLevel}
            />
          ))}
        </Accordion.Root>
      </Tabs.Content>
    </Tabs.Root>
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
            id: "4Xa7Pd",
            description:
              "Message on Admin side when user not filled Experience section.",
          })}
        </p>
      ) : (
        <>
          <p data-h2-padding="base(0, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              id: "SCCX7B",
              description: "Message for when no data exists for the section",
            })}
          </p>
          <p>
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Edit your experience options.",
                id: "c39xT8",
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
