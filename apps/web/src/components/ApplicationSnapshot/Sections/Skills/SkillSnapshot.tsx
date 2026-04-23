import { Fragment } from "react/jsx-runtime";
import { useIntl } from "react-intl";

import type { FragmentType, Skill } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import {
  Heading,
  ScrollToLink,
  Separator,
  Notice,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { nodeToString } from "@gc-digital-talent/helpers";

import type { SnapshotExperience } from "~/utils/experienceUtils";
import { getExperienceName } from "~/utils/experienceUtils";
import ExperienceCard, {
  ExperienceCard_Fragment,
} from "~/components/ExperienceCard/ExperienceCard";
import { groupExperiencesBySkill } from "~/utils/skillUtils";

interface SkillExperiencesProps {
  skill: Pick<Skill, "id">;
  experiences: SnapshotExperience[];
}

const SkillExperiences = ({ skill, experiences }: SkillExperiencesProps) => {
  const intl = useIntl();

  if (experiences.length <= 0) {
    return (
      <Notice.Root color="warning">
        <Notice.Content>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "There are no experiences attached to this skill.",
              id: "XrfkBm",
              description:
                "Message displayed when no experiences have been attached to a skill",
            })}
          </p>
        </Notice.Content>
      </Notice.Root>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      {experiences.map((experience) => (
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
  );
};

const SkillSnapshot_Fragment = graphql(/** GraphQL */ `
  fragment SkillSnapshot on Skill {
    id
    name {
      localized
    }
    description {
      localized
    }
  }
`);

interface SkillSnapshotProps {
  query: FragmentType<typeof SkillSnapshot_Fragment>[];
  experiences: SnapshotExperience[];
}

const SkillSnapshot = ({ query, experiences }: SkillSnapshotProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const skills = getFragment(SkillSnapshot_Fragment, query);

  if (skills.length <= 0) {
    return <p>{notAvailable}</p>;
  }

  const experiencesBySkill = groupExperiencesBySkill(experiences, skills);

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
      {experiencesBySkill.map(({ skill, experiences: exps }) => (
        <Fragment key={skill.id}>
          <Heading level="h4" size="h6" className="mt-12">
            {skill.name?.localized ?? notAvailable}
          </Heading>
          {skill.description?.localized && (
            <p className="mb-6">{skill.description.localized}</p>
          )}

          <Separator className="bg-error" space="sm" />

          <SkillExperiences skill={skill} experiences={exps} />
        </Fragment>
      ))}
    </>
  );
};

export default SkillSnapshot;
