import { useState } from "react";
import { useIntl } from "react-intl";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolSkillType,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { getLocalizedName, uiMessages } from "@gc-digital-talent/i18n";
import { Accordion, Button, Card, Heading } from "@gc-digital-talent/ui";

import PoolSkillAccordion from "~/components/PoolSkillAccordion/PoolSkillAccordion";

import sections from "../sections";
import {
  convertTemplateSkillToPoolSkillFragment,
  JobPosterTemplateSkills_Fragment,
} from "../templateSkills";

const JobPosterTemplateEssentialTechnicalSkills_Fragment = graphql(
  /* GraphQL */ `
    fragment JobPosterTemplateEssentialTechnicalSkills on JobPosterTemplate {
      essentialTechnicalSkillsNotes {
        en
        fr
      }
      ...JobPosterTemplateSkills
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
  const templateSkills =
    getFragment(
      JobPosterTemplateSkills_Fragment,
      jobPosterTemplate,
    ).templateSkills?.filter(
      (templateSkill) =>
        templateSkill.type.value == PoolSkillType.Essential &&
        templateSkill.skill?.category.value == SkillCategory.Technical,
    ) ?? [];

  // the accordion is made for PoolSkills, not JobPosterTemplateSkills
  const accordionItems = templateSkills.map((templateSkill) => ({
    key: templateSkill.id,
    poolSkillFragment: convertTemplateSkillToPoolSkillFragment(templateSkill),
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
      <Heading icon={BoltIcon} size="h2" color="error" className="mt-0 mb-6">
        {intl.formatMessage(sections.essentialTechnicalSkills.longTitle)}
      </Heading>
      <div className="flex flex-col gap-6">
        <div>
          {intl.formatMessage({
            defaultMessage:
              "Essential or required skills (also known as merit criteria) are the core skill requirements a candidate needs to perform the job. This list includes common skills that are often required for this role, but we recommend choosing only the skills that are absolutely necessary. A shorter list of required skills leads to stronger applications and simplifies the evaluation process.",
            id: "SojYxS",
            description:
              "Description displayed on the job poster template 'essential technical skills' section.",
          })}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-end">
            <Button
              mode="inline"
              color="primary"
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
                poolSkillQuery={accordionItem.poolSkillFragment}
              />
            ))}
          </Accordion.Root>
          {note ? (
            <Card className="text-sm text-gray-500 dark:text-gray-200">
              {note}
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EssentialTechnicalSkills;
