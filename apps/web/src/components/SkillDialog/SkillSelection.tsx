import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  Button,
  Collapsible,
  Link,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { invertSkillSkillFamilyTree } from "~/utils/skillUtils";
import { Skill, SkillCategory } from "~/api/generated";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import SkillDescription from "./SkillDescription";
import useRoutes from "../../hooks/useRoutes";

const suggestionLink = (chunks: React.ReactNode, href: string) => (
  <Link href={href}>{chunks}</Link>
);

interface SkillSelectionProps {
  skills: Skill[];
  onSelectSkill?: (skill: Skill | null) => void;
  showCategory?: boolean;
}

const SkillSelection = ({
  skills,
  onSelectSkill,
  showCategory = true,
}: SkillSelectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const { watch, resetField } = useFormContext();

  const [category, family, skill] = watch(["category", "family", "skill"]);

  const allSkillFamilies = React.useMemo(
    () => invertSkillSkillFamilyTree(skills),
    [skills],
  );

  const filteredSkills = React.useMemo(() => {
    if (family) {
      // We only care about family if it is set
      // since we are filtering families by category
      return skills.filter((currentSkill) =>
        currentSkill.families?.some((skillFamily) => skillFamily.id === family),
      );
    }
    if (category) {
      return skills.filter((currentSkill) =>
        currentSkill.families?.some(
          (skillFamily) => skillFamily.category === category,
        ),
      );
    }

    // neither is set so return all skills
    return skills;
  }, [category, family, skills]);

  const selectedSkill = React.useMemo(() => {
    return skill
      ? skills.find((currentSkill) => currentSkill.id === skill)
      : undefined;
  }, [skill, skills]);

  React.useEffect(() => {
    if (onSelectSkill) {
      onSelectSkill(selectedSkill || null);
    }
  }, [onSelectSkill, selectedSkill]);

  React.useEffect(() => {
    resetField("skill");
  }, [category, family, resetField]);

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-margin-bottom="base(x1)"
        {...(showCategory
          ? {
              "data-h2-grid-template-columns": "base(1fr) p-tablet(1fr 1fr)",
            }
          : {
              "data-h2-grid-template-columns": "base(1fr)",
            })}
      >
        {showCategory && (
          <Select
            id="skill-category"
            name="category"
            trackUnsaved={false}
            label={intl.formatMessage({
              defaultMessage: "Filter skills by category",
              id: "R9dzE0",
              description: "Label for the skill category filter field",
            })}
            options={[
              {
                value: "",
                label: intl.formatMessage({
                  defaultMessage: "All categories",
                  id: "ZtHmo1",
                  description: "Label for removing the skill category filter",
                }),
              },
              {
                value: SkillCategory.Behavioural,
                label: intl.formatMessage({
                  defaultMessage: "Behavioural skills",
                  id: "LjkK5G",
                  description: "Tab name for a list of behavioural skills",
                }),
              },
              {
                value: SkillCategory.Technical,
                label: intl.formatMessage({
                  defaultMessage: "Technical skills",
                  id: "kxseH4",
                  description: "Tab name for a list of technical skills",
                }),
              },
            ]}
          />
        )}
        <Select
          id="skill-family"
          name="family"
          trackUnsaved={false}
          label={intl.formatMessage({
            defaultMessage: "Filter skills by skill family",
            id: "wUlyLG",
            description: "Label for the skill family filter field",
          })}
          options={[
            {
              value: "",
              label: intl.formatMessage({
                defaultMessage: "All skill families",
                id: "eLk4bq",
                description: "Label for removing the skill family filter",
              }),
            },
            ...allSkillFamilies.map((skillFamily) => ({
              value: skillFamily.id,
              label: getLocalizedName(skillFamily.name, intl),
            })),
          ]}
        />
      </div>
      <div data-h2-margin="base(x1, 0)">
        <Combobox
          id="skill"
          name="skill"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          trackUnsaved={false}
          label={intl.formatMessage(
            {
              defaultMessage: "Select from {count} matching skills",
              id: "r5aKc8",
              description: "Label for the skill select field",
            },
            {
              count: filteredSkills.length,
            },
          )}
          options={filteredSkills.map((currentSkill) => ({
            value: currentSkill.id,
            label: getLocalizedName(currentSkill.name, intl),
          }))}
        />
      </div>
      {selectedSkill && <SkillDescription skill={selectedSkill} />}
      <Collapsible.Root
        open={isExpanded}
        onOpenChange={setIsExpanded}
        data-h2-margin="base(x1 0)"
      >
        <Collapsible.Trigger asChild>
          <Button
            type="button"
            mode="inline"
            color="black"
            data-h2-transform="base:children[.ExperienceCard__Chevron](rotate(0deg)) base:selectors[[data-state='open']]:children[.ExperienceCard__Chevron](rotate(90deg))"
          >
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(0 x.25)"
            >
              <ChevronRightIcon
                data-h2-height="base(x1.25)"
                data-h2-width="base(x1.25)"
                className="ExperienceCard__Chevron"
              />
              <span>
                {isExpanded
                  ? intl.formatMessage({
                      defaultMessage:
                        "Hide information on what to do if you can't find a skill",
                      id: "AxRGK2",
                      description:
                        "Button text to hide help information about skills",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "Find out what to do if you can't find a skill",
                      id: "mAN6yW",
                      description:
                        "Button text to show help information about skills",
                    })}
              </span>
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content data-h2-padding-left="base(x1.5)">
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background-color="base(gray.lighter)"
            data-h2-margin="base(x1 0)"
          />
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "If you can't find a skill, try broadening your filters or searching for the skill's name using other industry terms.",
              id: "Q0AKK4",
              description:
                "Help text to tell users to change their filters to find a skill",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you still can't find a skill, it's possible that it hasn't been added to our library yet! We're always growing our skills list and would love to hear from you. <a>Get in touch with your suggestion</a>.",
                id: "c0SFYY",
                description:
                  "Help text to tell users to change their filters to find a skill",
              },
              {
                a: (chunks: React.ReactNode) =>
                  suggestionLink(chunks, paths.support()),
              },
            )}
          </p>
        </Collapsible.Content>
      </Collapsible.Root>
      {!selectedSkill && (
        <Well>
          <p data-h2-text-align="base(center)">
            {intl.formatMessage({
              id: "HrRgTT",
              defaultMessage: "Please select a skill to continue.",
              description:
                "Help text to tell users to select a skill before submitting",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default SkillSelection;
