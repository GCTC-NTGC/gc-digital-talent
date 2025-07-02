import { useIntl } from "react-intl";

import { Skill, makeFragmentData } from "@gc-digital-talent/graphql";
import { Heading, ScrollToLink, Separator, Well } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { nodeToString } from "@gc-digital-talent/helpers";

import { getExperienceName, SnapshotExperience } from "~/utils/experienceUtils";
import ExperienceCard, {
  ExperienceCard_Fragment,
} from "~/components/ExperienceCard/ExperienceCard";
import { getExperienceSkills } from "~/utils/skillUtils";

interface SkillExperiencesProps {
  skill: Skill;
  experiences: SnapshotExperience[];
}

const SkillExperiences = ({ skill, experiences }: SkillExperiencesProps) => {
  const intl = useIntl();

  const skillExperiences = getExperienceSkills(experiences, skill);

  return (
    <>
      <Heading level="h4" size="h6" className="mt-12">
        {getLocalizedName(skill.name, intl)}
      </Heading>
      {skill.description && (
        <p className="mb-6">{getLocalizedName(skill.description, intl)}</p>
      )}
      <Separator className="bg-error" space="sm" />
      {skillExperiences.length ? (
        <div className="flex flex-col gap-y-3">
          {skillExperiences.map((experience) => (
            <ExperienceCard
              id={`skill-${skill.id}-experience-${experience.id}`}
              key={experience.id}
              experienceQuery={makeFragmentData(
                {
                  ...experience,
                  __typename: experience.__typename ?? "AwardExperience",
                },
                ExperienceCard_Fragment,
              )}
              headingLevel="h5"
              showEdit={false}
              showSkills={skill}
              hideDetails
              view={
                <ScrollToLink
                  to={`experience-${experience.id}`}
                  mode="inline"
                  color="error"
                  aria-label={String(
                    intl.formatMessage(
                      {
                        defaultMessage: "View experience for {experienceName}",
                        id: "MsLKAj",
                        description:
                          "Assistive technology link text to view a specific experience",
                      },
                      {
                        experienceName: nodeToString(
                          getExperienceName(experience, intl),
                        ),
                      },
                    ),
                  )}
                >
                  {intl.formatMessage({
                    defaultMessage: "View experience",
                    id: "hKofhr",
                    description: "Link text to view a specific experience",
                  })}
                </ScrollToLink>
              }
            />
          ))}
        </div>
      ) : (
        <Well color="warning">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "There are no experiences attached to this skill.",
              id: "XrfkBm",
              description:
                "Message displayed when no experiences have been attached to a skill",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

interface SkillDisplayProps {
  skills: Skill[];
  experiences: SnapshotExperience[];
}

const SkillDisplay = ({ skills, experiences }: SkillDisplayProps) => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage: "Represented by the following experiences:",
          id: "mDowK/",
          description:
            "Lead in text for experiences that represent the users skills",
        })}
      </p>
      {skills.map((skill) => (
        <SkillExperiences
          key={skill.id}
          skill={skill}
          experiences={experiences}
        />
      ))}
    </>
  );
};

export default SkillDisplay;
