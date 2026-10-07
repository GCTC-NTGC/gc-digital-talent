import { useIntl } from "react-intl";

import type {
  LocalizedString,
  SkillCategory,
  SkillLevel,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocalizedName,
  getSkillLevelName,
} from "@gc-digital-talent/i18n";
import type { HeadingRank } from "@gc-digital-talent/ui";
import { Notice, Ul } from "@gc-digital-talent/ui";

import ContentSection from "./ContentSection";

interface ExperienceSkillRecord {
  details?: string | null;
}

interface SkillCategoryValue {
  value: SkillCategory;
}

export interface ExperienceSkill {
  id: string;
  name?: LocalizedString | null;
  category?: SkillCategoryValue | null;
  experienceSkillRecord?: ExperienceSkillRecord | null;
}

// The user's level for a skill lives on their UserSkill, not on the experience
export interface UserSkillLevel {
  skillId: string;
  skillLevel?: SkillLevel | null;
}

interface SkillsContentProps {
  skills?: ExperienceSkill[] | null;
  userSkills?: UserSkillLevel[] | null;
  headingRank?: HeadingRank;
}

const SkillsContent = ({
  skills,
  userSkills,
  headingRank,
}: SkillsContentProps) => {
  const intl = useIntl();

  return (
    <ContentSection
      title={intl.formatMessage({
        defaultMessage: "Linked skills",
        id: "bgVX2E",
        description: "Heading for the list of skills linked to an experience",
      })}
      headingRank={headingRank}
    >
      {skills?.length ? (
        <Ul space="sm">
          {skills.map((skill) => {
            const skillLevel = userSkills?.find(
              (userSkill) => userSkill.skillId === skill.id,
            )?.skillLevel;
            const skillLevelName =
              skillLevel && skill.category
                ? intl.formatMessage(
                    getSkillLevelName(skillLevel, skill.category.value),
                  )
                : null;

            return (
              <li key={skill.id}>
                <span className="block font-bold">
                  {getLocalizedName(skill.name, intl)}
                  {skillLevelName && (
                    <span className="ml-1 font-normal text-gray-600 dark:text-gray-200">
                      {intl.formatMessage(
                        {
                          defaultMessage: "({skillLevel})",
                          id: "Gy+gGq",
                          description:
                            "The user's level for a skill, shown in brackets after the skill name",
                        },
                        { skillLevel: skillLevelName },
                      )}
                    </span>
                  )}
                </span>
                <span>
                  {skill.experienceSkillRecord?.details ??
                    intl.formatMessage(commonMessages.notAvailable)}
                </span>
              </li>
            );
          })}
        </Ul>
      ) : (
        <Notice.Root>
          <Notice.Content>
            <p className="text-center">
              {intl.formatMessage({
                defaultMessage:
                  "No skills have been linked to this experience.",
                id: "exxM/M",
                description:
                  "Text displayed when no skills have been linked to an experience",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
    </ContentSection>
  );
};

export default SkillsContent;
