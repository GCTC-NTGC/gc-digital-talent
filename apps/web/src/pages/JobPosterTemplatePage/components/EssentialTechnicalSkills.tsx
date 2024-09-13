import { useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Accordion, Heading } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";

import sections from "../sections";

const JobPosterTemplateEssentialTechnicalSkills_Fragment = graphql(
  /* GraphQL */ `
    fragment JobPosterTemplateEssentialTechnicalSkills on JobPosterTemplate {
      skillRelationships: skills {
        id
        pivot {
          requiredLevel
          type {
            value
          }
        }
        skill {
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          category {
            value
          }
        }
      }
      essentialTechnicalSkillsNotes {
        en
        fr
      }
    }
  `,
);

interface EssentialTechnicalSkillsProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateEssentialTechnicalSkills_Fragment
  >;
}

const EssentialTechnicalSkills = ({
  jobPosterTemplateQuery,
}: EssentialTechnicalSkillsProps) => {
  const intl = useIntl();
  const jobPosterTemplate = getFragment(
    JobPosterTemplateEssentialTechnicalSkills_Fragment,
    jobPosterTemplateQuery,
  );
  const note = getLocalizedName(
    jobPosterTemplate.essentialTechnicalSkillsNotes,
    intl,
    true,
  );
  return (
    <>
      <Heading
        Icon={BoltIcon}
        size="h2"
        color="tertiary"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(sections.essentialTechnicalSkills.longTitle)}
      </Heading>
      <div>
        {intl.formatMessage({
          defaultMessage:
            "Essential or required skills (also known as merit criteria) are the core skill requirements a candidate must absolutely meet in order to perform the job. This list suggests common skills that are often required for this role, but please note that we recommend choosing only skills that are absolutely essential to the role. Fewer skills translates to higher quality applications and provides candidates with more opportunity to expand on the key skills you need.",
          id: "kk+ohL",
          description:
            "Description displayed on the job poster template 'essential technical skills' section.",
        })}
      </div>
      <Accordion.Root mode="card" type="single" size="sm" collapsible>
        {jobPosterTemplate.skillRelationships?.map((relationship) => (
          <Accordion.Item key={relationship.id} value={relationship.id}>
            <Accordion.Trigger subtitle={relationship.pivot?.requiredLevel}>
              {getLocalizedName(relationship.skill.name, intl)}
            </Accordion.Trigger>
            <Accordion.Content>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x0.5)"
              >
                <FieldDisplay
                  label={intl.formatMessage({
                    defaultMessage: "This skill is defined as:",
                    id: "Yqh01h",
                    description: "Title for a skill definition",
                  })}
                >
                  {getLocalizedName(relationship.skill.description, intl)}
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage(
                    {
                      defaultMessage: "The “{skillLevel}” level is defined as:",
                      id: "qFLygw",
                      description: "Title for a skill level definition",
                    },
                    {
                      skillLevel: relationship.pivot?.requiredLevel,
                    },
                  )}
                >
                  {getLocalizedName(relationship.skill.description, intl)}
                </FieldDisplay>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      {note ? <div>{note}</div> : null}
    </>
  );
};

export default EssentialTechnicalSkills;
