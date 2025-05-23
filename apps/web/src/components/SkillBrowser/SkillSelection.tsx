import { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { normalizeString } from "@gc-digital-talent/helpers";
import { Skill } from "@gc-digital-talent/graphql";
import Select from "@gc-digital-talent/forms/Select";
import Combobox from "@gc-digital-talent/forms/Combobox";

import skillBrowserMessages from "./messages";
import SkillDescription from "./SkillDescription";
import {
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
} from "./utils";
import { FormValues } from "./types";

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
  const { watch, resetField } = useFormContext<FormValues>();

  const [family, skill] = watch(["family", "skill"]);

  const filteredFamilies = useMemo(() => {
    return getFilteredFamilies({ skills }).sort((familyA, familyB) => {
      const a = normalizeString(getLocalizedName(familyA.name, intl));
      const b = normalizeString(getLocalizedName(familyB.name, intl));

      if (a === b) return 0;

      return a > b ? 1 : -1;
    });
  }, [skills, intl]);

  const filteredSkills = useMemo(() => {
    return getFilteredSkills({ skills, family, inLibrary }).sort(
      (skillA, skillB) => {
        const a = normalizeString(getLocalizedName(skillA.name, intl));
        const b = normalizeString(getLocalizedName(skillB.name, intl));

        if (a === b) return 0;

        return a > b ? 1 : -1;
      },
    );
  }, [family, inLibrary, skills, intl]);

  const selectedSkill = useMemo(() => {
    return skill
      ? skills.find((currentSkill) => currentSkill.id === skill)
      : undefined;
  }, [skill, skills]);

  useEffect(() => {
    if (onSelectSkill) {
      onSelectSkill(selectedSkill ?? null);
    }
  }, [onSelectSkill, selectedSkill]);

  useEffect(() => {
    resetField("skill");
  }, [family, resetField]);

  useEffect(() => {
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
              label: getLocalizedName(skillFamily.name, intl),
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
