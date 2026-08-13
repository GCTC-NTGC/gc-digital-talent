import { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { Notice } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { normalizeString } from "@gc-digital-talent/helpers";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import skillBrowserMessages from "./messages";
import SkillDescription from "./SkillDescription";
import {
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
} from "./utils";
import type { FormValues, SelectedSkill } from "./types";

export const SkillBrowserSkill_Fragment = graphql(/* GraphQL */ `
  fragment SkillBrowserSkill on Skill {
    id
    name {
      localized
    }
    description {
      localized
    }
    category {
      value
    }
    families {
      id
      name {
        localized
      }
    }
  }
`);

interface SkillSelectionProps {
  query: FragmentType<typeof SkillBrowserSkill_Fragment>[];
  inLibraryQuery?: FragmentType<typeof SkillBrowserSkill_Fragment>[];
  onSelectSkill?: (skill: SelectedSkill | null) => void;
}

const SkillSelection = ({
  query,
  onSelectSkill,
  inLibraryQuery,
}: SkillSelectionProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext<FormValues>();

  const skills = getFragment(SkillBrowserSkill_Fragment, query);
  const inLibrary = getFragment(SkillBrowserSkill_Fragment, inLibraryQuery);

  const [family, skill] = watch(["family", "skill"]);

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
    inLibrary: inLibrary ? [...inLibrary] : undefined,
  }).sort((skillA, skillB) => {
    const a = normalizeString(skillA.name?.localized ?? "");
    const b = normalizeString(skillB.name?.localized ?? "");

    if (a === b) return 0;

    return a > b ? 1 : -1;
  });

  const selectedSkill = useMemo(() => {
    return skill
      ? skills.find((currentSkill) => currentSkill.id === skill)
      : undefined;
  }, [skill, skills]);

  useEffect(() => {
    if (onSelectSkill) {
      onSelectSkill(
        selectedSkill
          ? {
              id: selectedSkill.id,
              name: selectedSkill.name?.localized ?? null,
              category: selectedSkill.category.value,
            }
          : null,
      );
    }
  }, [onSelectSkill, selectedSkill]);

  useEffect(() => {
    resetField("skill");
  }, [family, resetField]);

  useEffect(() => {
    resetField("family");
  }, [resetField]);

  const familyOptions = getFamilyOptions(
    skills.map((currentSkill) => currentSkill.id),
    intl,
    inLibrary?.map((librarySkill) => librarySkill.id),
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <>
      <div className="mb-6 grid gap-6 sm:grid-cols-3">
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
              label: skillFamily.name?.localized ?? notAvailable,
            })),
          ]}
        />
        <div className="sm:col-span-2">
          <Combobox
            id="skill"
            name="skill"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            trackUnsaved={false}
            total={filteredSkills.length}
            label={intl.formatMessage(skillBrowserMessages.skill)}
            options={filteredSkills.map((currentSkill) => ({
              value: currentSkill.id,
              label: currentSkill.name?.localized ?? notAvailable,
            }))}
          />
        </div>
      </div>
      {!selectedSkill && (
        <Notice.Root>
          <Notice.Content>
            <p className="text-center">
              {intl.formatMessage(skillBrowserMessages.nullSkill)}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
      {selectedSkill && (
        <SkillDescription
          name={selectedSkill.name?.localized}
          description={selectedSkill.description?.localized}
        />
      )}
    </>
  );
};

export default SkillSelection;
