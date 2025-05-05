import { useIntl } from "react-intl";

import { Experience, Skill } from "@gc-digital-talent/graphql";
import { Heading, ScrollToLink, Separator, Well } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { nodeToString } from "@gc-digital-talent/helpers";

import { getExperienceName } from "~/utils/experienceUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import { getExperienceSkills } from "~/utils/skillUtils";

interface SkillExperiencesProps {
  skill: Skill;
  experiences: Omit<Experience, "user">[];
}

const SkillExperiences = ({ skill, experiences }: SkillExperiencesProps) => {
  const intl = useIntl();

  const skillExperiences = getExperienceSkills(experiences, skill);

  return (
    <>
      <Heading level="h4" size="h6" data-h2-margin-top="base(x2)">
        {getLocalizedName(skill.name, intl)}
      </Heading>
      {skill.description && (
        <p data-h2-margin-bottom="base(x1)">
          {getLocalizedName(skill.description, intl)}
        </p>
      )}
      <Separator data-h2-background-color="base(tertiary)" space="sm" />
      {skillExperiences.length ? (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {skillExperiences.map((experience) => (
            <ExperienceCard
              id={`skill-${skill.id}-experience-${experience.id}`}
              key={experience.id}
              experience={experience}
              headingLevel="h5"
              showEdit={false}
              showSkills={skill}
              hideDetails
              view={
                <ScrollToLink
                  to={`experience-${experience.id}`}
                  mode="inline"
                  color="tertiary"
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
  experiences: Omit<Experience, "user">[];
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
