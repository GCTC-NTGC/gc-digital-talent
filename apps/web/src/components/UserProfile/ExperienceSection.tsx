import { useIntl } from "react-intl";

import {
  Accordion,
  Tabs,
  HeadingRank,
  Button,
  Well,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";

import { compareByDate } from "~/utils/experienceUtils";
import useControlledCollapsibleGroup from "~/hooks/useControlledCollapsibleGroup";
import experienceMessages from "~/messages/experienceMessages";
import { invertSkillExperienceTree } from "~/utils/skillUtils";

import ExperienceCard from "../ExperienceCard/ExperienceCard";
import SkillAccordion from "./SkillAccordion/SkillAccordion";
import ExperienceByTypeListing from "./ExperienceByTypeListing";

const ProfileExperiencesSectionExperience_Fragment = graphql(/** GraphQL */ `
  fragment ProfileExperiencesSectionExperience on Experience {
    id
    ...ExperienceCard
    ...ExperienceByTypeListingExperience
  }
`);

interface ExperienceSectionProps {
  experiencesQuery?: FragmentType<
    typeof ProfileExperiencesSectionExperience_Fragment
  >[];
  editParam?: string;
  headingLevel?: HeadingRank;
}

const ExperienceSection = ({
  experiencesQuery,
  editParam,
  headingLevel = "h3",
}: ExperienceSectionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experiences = getFragment(
    ProfileExperiencesSectionExperience_Fragment,
    unpackMaybes(experiencesQuery),
  );

  const awardExperiences = experiences
    ?.filter((e) => e.__typename === "AwardExperience")
    .sort(compareByDate);
  const communityExperiences = experiences
    ?.filter((e) => e.__typename === "CommunityExperience")
    .sort(compareByDate);
  const educationExperiences = experiences
    ?.filter((e) => e.__typename === "EducationExperience")
    .sort(compareByDate);
  const personalExperiences = experiences
    ?.filter((e) => e.__typename === "PersonalExperience")
    .sort(compareByDate);
  const workExperiences = experiences
    ?.filter((e) => e.__typename === "WorkExperience")
    .sort(compareByDate);

  const allExperiences = [
    ...awardExperiences,
    ...communityExperiences,
    ...educationExperiences,
    ...personalExperiences,
    ...workExperiences,
  ];

  const sortedByDate = allExperiences.sort(compareByDate);
  const { isExpanded, hasExpanded, toggleAllExpanded, toggleExpandedItem } =
    useControlledCollapsibleGroup(sortedByDate.map(({ id }) => id));

  const allSkills = invertSkillExperienceTree(allExperiences);
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
        <p className="mb-3 text-right">
          <Button mode="inline" onClick={toggleAllExpanded}>
            {intl.formatMessage(
              hasExpanded
                ? experienceMessages.collapseDetails
                : experienceMessages.expandDetails,
            )}
          </Button>
        </p>
        <div className="flex flex-col gap-y-3">
          {sortedByDate.map((experience) => (
            <ExperienceCard
              headingLevel={headingLevel}
              key={experience.id}
              onOpenChange={() => toggleExpandedItem(experience.id)}
              isOpen={isExpanded(experience.id)}
              experienceQuery={experience}
              showEdit={false}
              editParam={editParam}
            />
          ))}
        </div>
      </Tabs.Content>
      <Tabs.Content value="1">
        <ExperienceByTypeListing
          headingLevel={headingLevel}
          experiencesQuery={experiences}
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
