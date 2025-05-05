import { useMemo } from "react";
import { useIntl } from "react-intl";

import {
  Accordion,
  Tabs,
  HeadingRank,
  Button,
  Well,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import { AwardExperience, Experience } from "@gc-digital-talent/graphql";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import useControlledCollapsibleGroup from "~/hooks/useControlledCollapsibleGroup";
import experienceMessages from "~/messages/experienceMessages";
import { invertSkillExperienceTree } from "~/utils/skillUtils";

import ExperienceCard from "../ExperienceCard/ExperienceCard";
import SkillAccordion from "./SkillAccordion/SkillAccordion";
import ExperienceByTypeListing from "./ExperienceByTypeListing";

interface ExperienceSectionProps {
  experiences?: Omit<Experience, "user">[];
  editParam?: string;
  headingLevel?: HeadingRank;
}

const ExperienceSection = ({
  experiences,
  editParam,
  headingLevel = "h3",
}: ExperienceSectionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const awardExperiences = useMemo(
    () =>
      experiences
        ?.filter(isAwardExperience)
        .map(
          (award: Omit<AwardExperience, "user">) =>
            ({
              ...award,
              startDate: award.awardedDate,
              endDate: award.awardedDate,
            }) as AwardExperience & { startDate: string; endDate: string },
        )
        .sort(compareByDate) ?? [],
    [experiences],
  );

  const communityExperiences = useMemo(
    () => experiences?.filter(isCommunityExperience).sort(compareByDate) ?? [],
    [experiences],
  );

  const educationExperiences = useMemo(
    () => experiences?.filter(isEducationExperience).sort(compareByDate) ?? [],
    [experiences],
  );

  const personalExperiences = useMemo(
    () => experiences?.filter(isPersonalExperience).sort(compareByDate) ?? [],
    [experiences],
  );

  const workExperiences = useMemo(
    () => experiences?.filter(isWorkExperience).sort(compareByDate) ?? [],
    [experiences],
  );

  const allExperiences = useMemo(
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
  const { isExpanded, hasExpanded, toggleAllExpanded, toggleExpandedItem } =
    useControlledCollapsibleGroup(sortedByDate.map(({ id }) => id));

  const allSkills = useMemo(
    () => invertSkillExperienceTree(allExperiences),
    [allExperiences],
  );
  const skillIds = allSkills.map(({ id }) => id);
  const sortedBySkills = allSkills
    .filter(({ id }, index) => !skillIds.includes(id, index + 1)) //  Remove duplicate skills
    .sort(sortAlphaBy((skill) => skill.name[locale]));

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
        <p data-h2-margin-bottom="base(x.5)" data-h2-text-align="base(right)">
          <Button mode="inline" onClick={toggleAllExpanded}>
            {intl.formatMessage(
              hasExpanded
                ? experienceMessages.collapseDetails
                : experienceMessages.expandDetails,
            )}
          </Button>
        </p>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {sortedByDate.map((experience) => (
            <ExperienceCard
              headingLevel={headingLevel}
              key={experience.id}
              onOpenChange={() => toggleExpandedItem(experience.id)}
              isOpen={isExpanded(experience.id)}
              experience={experience}
              showEdit={false}
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
        ) : (
          <Well>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "No skills have been linked to any experiences.",
                id: "23/pqm",
                description:
                  "Null state for when no skills have been linked to any experiences",
              })}
            </p>
          </Well>
        )}
      </Tabs.Content>
    </Tabs.Root>
  ) : (
    <Well>
      <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
    </Well>
  );
};

export default ExperienceSection;
