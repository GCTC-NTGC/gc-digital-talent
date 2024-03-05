import * as React from "react";
import { useIntl } from "react-intl";

import { Accordion, Tabs, HeadingRank, Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
import { AwardExperience, Experience } from "@gc-digital-talent/graphql";

import { invertSkillExperienceTree } from "~/utils/skillUtils";
import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

import ExperienceCard from "../ExperienceCard/ExperienceCard";
import SkillAccordion from "./SkillAccordion/SkillAccordion";
import ExperienceByTypeListing from "./ExperienceByTypeListing";

interface ExperienceSectionProps {
  experiences?: Experience[];
  editParam?: string;
  editPath?: string;
  headingLevel?: HeadingRank;
}

const ExperienceSection = ({
  experiences,
  editPath,
  editParam,
  headingLevel = "h3",
}: ExperienceSectionProps) => {
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
            }) as AwardExperience & { startDate: string; endDate: string },
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
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {sortedByDate.map((experience) => (
            <ExperienceCard
              headingLevel={headingLevel}
              key={experience.id}
              experience={experience}
              editParam={editParam}
            />
          ))}
        </div>
      </Tabs.Content>
      <Tabs.Content value="1">
        <ExperienceByTypeListing
          headingLevel={headingLevel}
          experiences={experiences}
          editParam={editParam}
        />
      </Tabs.Content>
      <Tabs.Content value="2">
        {sortedBySkills.length ? (
          <Accordion.Root type="multiple" mode="card">
            {sortedBySkills.map((skill) => (
              <SkillAccordion
                key={skill.id}
                skill={skill}
                headingLevel={headingLevel}
              />
            ))}
          </Accordion.Root>
        ) : null}
      </Tabs.Content>
    </Tabs.Root>
  ) : (
    <div
      data-h2-background-color="base(background.dark)"
      data-h2-border="base(1px solid background.darker)"
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
            <Link mode="inline" href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Edit your experience options.",
                id: "c39xT8",
                description:
                  "Link text to edit experience information on profile.",
              })}
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ExperienceSection;
