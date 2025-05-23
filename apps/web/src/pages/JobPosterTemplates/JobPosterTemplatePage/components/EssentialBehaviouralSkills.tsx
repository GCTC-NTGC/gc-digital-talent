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
import { Accordion, Button, CardBasic, Heading } from "@gc-digital-talent/ui";

import PoolSkillAccordion from "~/components/PoolSkillAccordion/PoolSkillAccordion";

import sections from "../sections";
import {
  convertTemplateSkillToPoolSkillFragment,
  JobPosterTemplateSkills_Fragment,
} from "../templateSkills";

const JobPosterTemplateEssentialBehaviouralSkills_Fragment = graphql(
  /* GraphQL */ `
    fragment JobPosterTemplateEssentialBehaviouralSkills on JobPosterTemplate {
      essentialBehaviouralSkillsNotes {
        en
        fr
      }
      ...JobPosterTemplateSkills
    }
  `,
);

interface EssentialBehaviouralSkillsProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateEssentialBehaviouralSkills_Fragment
  >;
}

const EssentialBehaviouralSkills = ({
  jobPosterTemplateQuery,
}: EssentialBehaviouralSkillsProps) => {
  const intl = useIntl();
  const [expandedSkillsValue, setExpandedSkillsValue] = useState<string[]>([]);
  const jobPosterTemplate = getFragment(
    JobPosterTemplateEssentialBehaviouralSkills_Fragment,
    jobPosterTemplateQuery,
  );

  const note = getLocalizedName(
    jobPosterTemplate.essentialBehaviouralSkillsNotes,
    intl,
    true,
  );
  const templateSkills =
    getFragment(
      JobPosterTemplateSkills_Fragment,
      jobPosterTemplate,
    ).templateSkills?.filter(
      (templateSkill) =>
        templateSkill.pivot?.type.value == PoolSkillType.Essential &&
        templateSkill.skill.category.value == SkillCategory.Behavioural,
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
      <Heading
        Icon={BoltIcon}
        size="h2"
        color="warning"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(sections.essentialBehaviouralSkills.longTitle)}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <div>
          {intl.formatMessage({
            defaultMessage:
              "In similar fashion to the essential technical skills, this list offers recommendations for the behavioural skills commonly required for this role. We recommend keeping essential behavioural skills limited to the exact requirements for your position or team to help candidates highlight the most relevant experience.",
            id: "/4z9lj",
            description:
              "Description displayed on the job poster template 'essential behavioural skills' section.",
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
                poolSkillQuery={accordionItem.poolSkillFragment}
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

export default EssentialBehaviouralSkills;
