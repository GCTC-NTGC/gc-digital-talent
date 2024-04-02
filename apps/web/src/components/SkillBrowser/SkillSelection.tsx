import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { normalizeString } from "@gc-digital-talent/helpers";
import { Skill } from "@gc-digital-talent/graphql";

import skillBrowserMessages from "./messages";
import SkillDescription from "./SkillDescription";
import {
  formatOption,
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
  getSkillFamilySkillCount,
} from "./utils";

interface SkillSelectionProps {
  skills: Skill[];
  inLibrary?: Skill[];
  onSelectSkill?: (skill: Skill | null) => void;
}

const SkillSelection = ({
  skills,
  onSelectSkill,
  inLibrary,
}: SkillSelectionProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

  const [family, skill] = watch(["family", "skill"]);

  const filteredFamilies = React.useMemo(() => {
    return getFilteredFamilies({ skills }).sort((familyA, familyB) => {
      const a = normalizeString(getLocalizedName(familyA.name, intl));
      const b = normalizeString(getLocalizedName(familyB.name, intl));

      if (a === b) return 0;

      return a > b ? 1 : -1;
    });
  }, [skills, intl]);

  const filteredSkills = React.useMemo(() => {
    return getFilteredSkills({ skills, family, inLibrary }).sort(
      (skillA, skillB) => {
        const a = normalizeString(getLocalizedName(skillA.name, intl));
        const b = normalizeString(getLocalizedName(skillB.name, intl));

        if (a === b) return 0;

        return a > b ? 1 : -1;
      },
    );
  }, [family, inLibrary, skills, intl]);

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
  }, [family, resetField]);

  React.useEffect(() => {
    resetField("family");
  }, [resetField]);

  const familyOptions = getFamilyOptions(skills, intl, inLibrary);

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-margin-bottom="base(x1)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
      >
        <Select
          id="skill-family"
          name="family"
          nullSelection={intl.formatMessage(
            skillBrowserMessages.skillFamilyPlaceholder,
          )}
          trackUnsaved={false}
          doNotSort
          label={intl.formatMessage(skillBrowserMessages.skillFamily)}
          options={[
            ...familyOptions,
            ...filteredFamilies.map((skillFamily) => ({
              value: skillFamily.id,
              label: formatOption(
                getLocalizedName(skillFamily.name, intl),
                getSkillFamilySkillCount(skills, skillFamily),
                intl,
              ),
            })),
          ]}
        />
        <div data-h2-grid-column="l-tablet(span 2)">
          <Combobox
            id="skill"
            name="skill"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            trackUnsaved={false}
            total={filteredSkills.length}
            label={intl.formatMessage(skillBrowserMessages.skill)}
            options={filteredSkills.map((currentSkill) => ({
              value: currentSkill.id,
              label: getLocalizedName(currentSkill.name, intl),
            }))}
          />
        </div>
      </div>
      {!selectedSkill && (
        <Well>
          <p data-h2-text-align="base(center)">
            {intl.formatMessage(skillBrowserMessages.nullSkill)}
          </p>
        </Well>
      )}
      {selectedSkill && <SkillDescription skill={selectedSkill} />}
    </>
  );
};

export default SkillSelection;
