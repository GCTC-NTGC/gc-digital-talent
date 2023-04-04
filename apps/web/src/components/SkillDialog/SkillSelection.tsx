import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { invertSkillSkillFamilyTree } from "~/utils/skillUtils";
import { Skill, SkillCategory } from "~/api/generated";

interface SkillSelectionProps {
  skills: Skill[];
  onSelectSkill?: (skill: Skill | null) => void;
  showStep?: boolean;
}

const SkillSelection = ({
  skills,
  onSelectSkill,
  showStep = true,
}: SkillSelectionProps) => {
  const intl = useIntl();
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
      <Heading level="h2" size="h5">
        {showStep
          ? intl.formatMessage({
              defaultMessage: "1. Find the skill you'd like to add",
              id: "ZxKojq",
              description: "Title for first step of claiming a skill",
            })
          : intl.formatMessage({
              defaultMessage: "Find the skill you'd like to add",
              id: "mfeD78",
              description: "Title for finding a skill",
            })}
      </Heading>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(0, x1) p-tablet(x1, 0)"
        data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
        data-h2-margin="base(x1, 0)"
      >
        <div data-h2-margin="base(-x1, 0)">
          <Select
            id="skill-category"
            name="category"
            trackUnsaved={false}
            label={intl.formatMessage({
              defaultMessage: "Filter skills by type",
              id: "ykhJPf",
              description: "Label for the skill category filter field",
            })}
            options={[
              {
                value: "",
                label: intl.formatMessage({
                  defaultMessage: "All types",
                  id: "jzWq2c",
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
        </div>
        <div data-h2-margin="base(-x1, 0)">
          <Select
            id="skill-family"
            name="family"
            trackUnsaved={false}
            label={intl.formatMessage({
              defaultMessage: "Filter skills by role",
              id: "syr9Ti",
              description: "Label for the skill family filter field",
            })}
            options={[
              {
                value: "",
                label: intl.formatMessage({
                  defaultMessage: "All roles",
                  id: "Y3HD10",
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
      </div>
      <div data-h2-margin="base(x1, 0)">
        <Combobox
          id="skill"
          name="skill"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          trackUnsaved={false}
          label={intl.formatMessage({
            defaultMessage: "Search for or select a skill",
            id: "PzzmGG",
            description: "Label for the skill select field",
          })}
          options={filteredSkills.map((currentSkill) => ({
            value: currentSkill.id,
            label: getLocalizedName(currentSkill.name, intl),
          }))}
        />
      </div>
      {selectedSkill && (
        <>
          <Heading level="h3" size="h6" data-h2-font-weight="base(400)">
            {intl.formatMessage({
              defaultMessage: "How this skill is defined",
              id: "ZP30Tz",
              description: "Heading for a specific skills definition",
            })}
          </Heading>
          <p data-h2-margin="base(x1, 0)">
            {getLocalizedName(selectedSkill.description, intl)}
          </p>
        </>
      )}
    </>
  );
};

export default SkillSelection;
