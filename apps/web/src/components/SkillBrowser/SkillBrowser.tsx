import { useId, useEffect } from "react";
import { useIntl } from "react-intl";
import type { RegisterOptions } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { normalizeString } from "@gc-digital-talent/helpers";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment } from "@gc-digital-talent/graphql";

import type { FormValues } from "./types";
import skillBrowserMessages from "./messages";
import { SkillBrowserSkill_Fragment } from "./SkillSelection";
import {
  INPUT_NAME,
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
} from "./utils";

interface SkillBrowserProps {
  query: FragmentType<typeof SkillBrowserSkill_Fragment>[];
  name: string;
  isMulti?: boolean;
  rules?: RegisterOptions;
}

const SkillBrowser = ({
  query,
  name,
  rules,
  isMulti = true,
}: SkillBrowserProps) => {
  const intl = useIntl();
  const skills = getFragment(SkillBrowserSkill_Fragment, query);
  const id = useId();
  const inputNames = {
    category: `${id}-${INPUT_NAME.CATEGORY}`,
    family: `${id}-${INPUT_NAME.FAMILY}`,
  };
  const { watch, resetField, setValue } = useFormContext<{
    [inputNames.family]: FormValues["family"];
    [name]: FormValues["skill"];
  }>();
  const [family, skillValue] = watch([inputNames.family, name]);

  const filteredFamilies = getFilteredFamilies({ skills: [...skills] }).sort(
    (familyA, familyB) => {
      const a = normalizeString(familyA.name?.localized ?? "");
      const b = normalizeString(familyB.name?.localized ?? "");

      if (a === b) return 0;

      return a > b ? 1 : -1;
    },
  );

  const filteredSkills = getFilteredSkills({
    skills: [...skills],
    family,
  }).sort((skillA, skillB) => {
    const a = normalizeString(skillA.name?.localized ?? "");
    const b = normalizeString(skillB.name?.localized ?? "");

    if (a === b) return 0;

    return a > b ? 1 : -1;
  });

  useEffect(() => {
    resetField("skill");
  }, [family, resetField]);

  useEffect(() => {
    resetField(inputNames.family);
  }, [inputNames.family, resetField]);

  useEffect(() => {
    if ((skillValue?.length ?? 0) > 0 && !family) {
      setValue(inputNames.family, "all");
    }
  }, [skillValue, family, setValue, inputNames.family]);

  const familyOptions = getFamilyOptions(
    skills.map((currentSkill) => currentSkill.id),
    intl,
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <div className="mb-6 grid gap-6 sm:grid-cols-3">
      <Select
        id={inputNames.family}
        name={inputNames.family}
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
            label: skillFamily.name?.localized ?? notAvailable,
          })),
        ]}
      />
      <div className="sm:col-span-2">
        <Combobox
          id="skill"
          name={name}
          isMulti={isMulti}
          trackUnsaved={false}
          total={filteredSkills.length}
          rules={rules}
          label={intl.formatMessage(skillBrowserMessages.skill)}
          options={filteredSkills.map((currentSkill) => ({
            value: currentSkill.id,
            label: currentSkill.name?.localized ?? notAvailable,
          }))}
        />
      </div>
    </div>
  );
};

export default SkillBrowser;
