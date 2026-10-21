import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import type {
  LocalizedString,
  SkillCategory,
  SkillLevel,
} from "@gc-digital-talent/graphql";
import { commonMessages, getSkillLevelName } from "@gc-digital-talent/i18n";
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
        defaultMessage: "Featured skills",
        id: "G+19bL",
        description:
          "Heading for the list of skills connected to an experience",
      })}
      headingRank={headingRank}
    >
      {skills?.length ? (
        <Ul space="sm">
          {skills.map((skill) => {
            const skillLevel = userSkills?.find(
              (userSkill) => userSkill.skillId === skill.id,
            )?.skillLevel;
            const skillName =
              skill.name?.localized ??
              intl.formatMessage(commonMessages.notAvailable);

            return (
              <li key={skill.id}>
                <span className="block font-bold">
                  {skillLevel && skill.category
                    ? intl.formatMessage(
                        {
                          defaultMessage:
                            "{skillName} <level>({skillLevel})</level>",
                          id: "7s9m+f",
                          description:
                            "A skill name followed by the user's level for that skill in brackets",
                        },
                        {
                          skillName,
                          skillLevel: intl.formatMessage(
                            getSkillLevelName(skillLevel, skill.category.value),
                          ),
                          level: (chunks: ReactNode) => (
                            <span className="font-normal text-gray-600 dark:text-gray-200">
                              {chunks}
                            </span>
                          ),
                        },
                      )
                    : skillName}
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
