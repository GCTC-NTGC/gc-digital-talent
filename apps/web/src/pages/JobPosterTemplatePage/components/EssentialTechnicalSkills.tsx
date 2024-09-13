import { useState } from "react";
import { useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import {
  FragmentType,
  getFragment,
  graphql,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import { getLocalizedName, uiMessages } from "@gc-digital-talent/i18n";
import { Accordion, Button, CardBasic, Heading } from "@gc-digital-talent/ui";

import PoolSkillAccordion, {
  PoolSkillAccordion_Fragment,
} from "~/components/PoolSkillAccordion/PoolSkillAccordion";

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
          id
          key
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
  const [expandedSkillsValue, setExpandedSkillsValue] = useState<string[]>([]);
  const jobPosterTemplate = getFragment(
    JobPosterTemplateEssentialTechnicalSkills_Fragment,
    jobPosterTemplateQuery,
  );
  const note = getLocalizedName(
    jobPosterTemplate.essentialTechnicalSkillsNotes,
    intl,
    true,
  );

  const skillRelationships =
    jobPosterTemplate.skillRelationships?.filter(
      (r) =>
        r.pivot?.type.value == "ESSENTIAL" &&
        r.skill.category.value == "TECHNICAL",
    ) ?? [];

  // the accordion is made for PoolSkills, not JobPosterTemplateSkills
  const accordionItems: {
    poolSkillQuery: React.ComponentProps<
      typeof PoolSkillAccordion
    >["poolSkillQuery"];
    key: string;
  }[] = skillRelationships.map((r) => ({
    poolSkillQuery: makeFragmentData(
      {
        id: r.id,
        requiredLevel: r.pivot?.requiredLevel,
        skill: r.skill,
      },
      PoolSkillAccordion_Fragment,
    ),
    key: r.id,
  }));

  const toggleExpandedSkillsValue = () => {
    if (expandedSkillsValue.length > 0) {
      setExpandedSkillsValue([]);
    } else {
      const keys = accordionItems.map((item) => item.key);

      setExpandedSkillsValue(keys);
    }
  };

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
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <div>
          {intl.formatMessage({
            defaultMessage:
              "Essential or required skills (also known as merit criteria) are the core skill requirements a candidate must absolutely meet in order to perform the job. This list suggests common skills that are often required for this role, but please note that we recommend choosing only skills that are absolutely essential to the role. Fewer skills translates to higher quality applications and provides candidates with more opportunity to expand on the key skills you need.",
            id: "kk+ohL",
            description:
              "Description displayed on the job poster template 'essential technical skills' section.",
          })}
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x0.15)"
        >
          <div
            data-h2-display="base(flex)"
            data-h2-justify-content="base(flex-end)"
          >
            <Button
              mode="inline"
              color="secondary"
              onClick={toggleExpandedSkillsValue}
              aria-label={
                expandedSkillsValue.length > 0
                  ? intl.formatMessage({
                      defaultMessage: "Collapse all skills",
                      id: "+PGnDL",
                      description:
                        "Accessible link text to collapse all accordions for skills",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Expand all skills",
                      id: "MZSPTS",
                      description:
                        "Accessible link text to expand all accordions for skills",
                    })
              }
            >
              {intl.formatMessage(
                expandedSkillsValue.length > 0
                  ? uiMessages.collapseAll
                  : uiMessages.expandAll,
              )}
            </Button>
          </div>
          <Accordion.Root
            type="multiple"
            mode="card"
            size="sm"
            value={expandedSkillsValue}
            onValueChange={setExpandedSkillsValue}
          >
            {accordionItems.map((accordionItem) => (
              <PoolSkillAccordion
                key={accordionItem.key}
                poolSkillQuery={accordionItem.poolSkillQuery}
              />
            ))}
          </Accordion.Root>
          {note ? (
            <CardBasic
              data-h2-font-size="base(caption)"
              data-h2-color="base(black.light)"
            >
              {note}
            </CardBasic>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EssentialTechnicalSkills;
