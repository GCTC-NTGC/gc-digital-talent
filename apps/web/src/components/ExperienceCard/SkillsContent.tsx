import { useIntl } from "react-intl";

import type { LocalizedString } from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type { HeadingRank } from "@gc-digital-talent/ui";
import { Notice, Ul } from "@gc-digital-talent/ui";

import ContentSection from "./ContentSection";

interface ExperienceSkillRecord {
  details?: string | null;
}

export interface ExperienceSkill {
  id: string;
  name?: LocalizedString | null;
  experienceSkillRecord?: ExperienceSkillRecord | null;
}

interface SkillsContentProps {
  skills?: ExperienceSkill[] | null;
  headingRank?: HeadingRank;
}

const SkillsContent = ({ skills, headingRank }: SkillsContentProps) => {
  const intl = useIntl();

  return (
    <>
      <ContentSection
        headingRank={headingRank}
        title={intl.formatMessage({
          defaultMessage: "Linked skills",
          id: "bgVX2E",
          description: "Heading for the list of skills linked to an experience",
        })}
      >
        {intl.formatMessage({
          defaultMessage:
            "You can link new skills by editing this experience or adding the skill to your skills portfolio. Skills added to this experience through job applications also appear here.",
          id: "9nwXXJ",
          description:
            "Lead in text for list of skills linked to a specific experience",
        })}
      </ContentSection>
      <div className="mt-6">
        {skills?.length ? (
          <Ul space="sm">
            {skills.map((skill) => (
              <li key={skill.id}>
                <span className="block font-bold">
                  {getLocalizedName(skill.name, intl)}
                </span>
                <span>
                  {skill.experienceSkillRecord?.details ??
                    intl.formatMessage(commonMessages.notAvailable)}
                </span>
              </li>
            ))}
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
      </div>
    </>
  );
};

export default SkillsContent;
