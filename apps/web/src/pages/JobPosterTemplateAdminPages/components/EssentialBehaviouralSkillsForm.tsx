import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect } from "react";

import { Checkbox, TextArea } from "@gc-digital-talent/forms";
import { errorMessages, Locales } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import SkillProficiencyList, {
  ListItem as SkillProficiencyListItem,
  SkillProficiencyListProps,
} from "~/components/SkillProficiencyList/SkillProficiencyList";

import { labels } from "./labels";
import { insertionIndexBySkillName } from "./utils";

const TEXT_AREA_MAX_WORDS_EN = 100;

const specialNoteWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const Options_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateEssentialBehaviouralSkillsFormOptions on Query {
    skills {
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
    }
    ...SkillProficiencyListOptions
  }
`);

export interface FormValues {
  essentialBehaviouralSkillProficiencies: SkillProficiencyListItem[] | null;
  isEssentialBehaviouralSkillsNoteRequired: boolean | null;
  essentialBehaviouralSkillsNotesEn: string | null;
  essentialBehaviouralSkillsNotesFr: string | null;
}

interface EssentialBehaviouralSkillsFormProps {
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const EssentialBehaviouralSkillsForm = ({
  optionsQuery,
}: EssentialBehaviouralSkillsFormProps) => {
  const intl = useIntl();

  const methods = useFormContext<FormValues>();
  const { control, watch, resetField, setValue } = methods;

  const watchIsNoteRequired = watch("isEssentialBehaviouralSkillsNoteRequired");

  const {
    fields: skillProficiencies,
    insert: insertIntoSkillProficiencies,
    remove: removeFromSkillProficiencies,
    update: updateSkillProficiency,
  } = useFieldArray({
    control,
    name: "essentialBehaviouralSkillProficiencies",
  });

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  useEffect(() => {
    if (watchIsNoteRequired) {
      resetField("essentialBehaviouralSkillsNotesEn");
      resetField("essentialBehaviouralSkillsNotesFr");
    } else {
      setValue("essentialBehaviouralSkillsNotesEn", null);
      setValue("essentialBehaviouralSkillsNotesFr", null);
    }
  }, [resetField, setValue, watchIsNoteRequired]);

  const optionsData = getFragment(Options_Fragment, optionsQuery);
  const allSkills = unpackMaybes(optionsData.skills);

  // a skill proficiency was edited in the list
  const handleEditSkillProficiency: SkillProficiencyListProps["onEdit"] = ({
    index,
    skillId,
    skillLevel,
  }) => {
    if (skillId) {
      const matchingSkill = allSkills.find((skill) => skill.id === skillId);
      const updatedItem: SkillProficiencyListItem = {
        skillId,
        skillName: matchingSkill?.name.localized ?? null,
        skillLevel,
        skillDefinition: matchingSkill?.description?.localized ?? null,
        skillCategory: matchingSkill?.category.value ?? null,
      };
      updateSkillProficiency(index, updatedItem);
      return Promise.resolve();
    }
    return Promise.reject(new Error("No skill ID provided."));
  };

  // a skill proficiency was removed from the list
  const handleRemoveSkillProficiency: SkillProficiencyListProps["onRemove"] = ({
    index,
  }) => {
    removeFromSkillProficiencies(index);
    return Promise.resolve();
  };

  // a skill proficiency was added to the list
  const handleAddSkillProficiency: SkillProficiencyListProps["onAdd"] = ({
    skillId,
    skillLevel,
  }) => {
    if (skillId) {
      const matchingSkill = allSkills.find((skill) => skill.id === skillId);
      const newItem: SkillProficiencyListItem = {
        skillId,
        skillName: matchingSkill?.name.localized ?? null,
        skillLevel,
        skillDefinition: matchingSkill?.description?.localized ?? null,
        skillCategory: matchingSkill?.category.value ?? null,
      };
      const sortedIndex = insertionIndexBySkillName(
        skillProficiencies,
        newItem,
      );
      insertIntoSkillProficiencies(sortedIndex, newItem);
      return Promise.resolve();
    }
    return Promise.reject(new Error("No skill ID provided."));
  };

  return (
    <div className="flex flex-col gap-6">
      <SkillProficiencyList
        optionsQuery={optionsData}
        filterOptionsSkillCategory={SkillCategory.Behavioural}
        listItems={skillProficiencies}
        onEdit={handleEditSkillProficiency}
        onRemove={handleRemoveSkillProficiency}
        onAdd={handleAddSkillProficiency}
        noToast
        skillLevelIsRequired={true}
      />
      <div>
        <Checkbox
          id="isEssentialBehaviouralSkillsNoteRequired"
          name="isEssentialBehaviouralSkillsNoteRequired"
          label={intl.formatMessage(labels.specialNoteIsRequired)}
          boundingBox
          boundingBoxLabel={intl.formatMessage(
            labels.specialNoteEssentialBehaviouralSkills,
          )}
        />
      </div>
      {watchIsNoteRequired ? (
        <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2">
          <div>
            <TextArea
              id="essentialBehaviouralSkillsNotesEn"
              name="essentialBehaviouralSkillsNotesEn"
              wordLimit={specialNoteWordCountLimits.en}
              label={intl.formatMessage(labels.specialNoteEn)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
          <div>
            <TextArea
              id="essentialBehaviouralSkillsNotesFr"
              name="essentialBehaviouralSkillsNotesFr"
              wordLimit={specialNoteWordCountLimits.fr}
              label={intl.formatMessage(labels.specialNoteFr)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EssentialBehaviouralSkillsForm;
