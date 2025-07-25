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
import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";

import { insertionIndexBySkillName } from "./utils";
import EssentialTechnicalSkillsFrontMatter from "./EssentialTechnicalSkillsFrontMatter";

const TEXT_AREA_MAX_WORDS_EN = 100;

const specialNoteWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const Options_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateEssentialTechnicalSkillsFormOptions on Query {
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
  essentialTechnicalSkillProficiencies: SkillProficiencyListItem[] | null;
  isEssentialTechnicalSkillsNoteRequired: boolean | null;
  essentialTechnicalSkillsNotesEn: string | null;
  essentialTechnicalSkillsNotesFr: string | null;
}

interface EssentialTechnicalSkillsFormProps {
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const EssentialTechnicalSkillsForm = ({
  optionsQuery,
}: EssentialTechnicalSkillsFormProps) => {
  const intl = useIntl();

  const methods = useFormContext<FormValues>();
  const { control, watch, resetField, setValue } = methods;

  const watchIsNoteRequired = watch("isEssentialTechnicalSkillsNoteRequired");

  const {
    fields: skillProficiencies,
    insert: insertIntoSkillProficiencies,
    remove: removeFromSkillProficiencies,
    update: updateSkillProficiency,
  } = useFieldArray({
    control,
    name: "essentialTechnicalSkillProficiencies",
  });

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  useEffect(() => {
    if (watchIsNoteRequired) {
      resetField("essentialTechnicalSkillsNotesEn");
      resetField("essentialTechnicalSkillsNotesFr");
    } else {
      setValue("essentialTechnicalSkillsNotesEn", null);
      setValue("essentialTechnicalSkillsNotesFr", null);
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
      <EssentialTechnicalSkillsFrontMatter />
      <SkillProficiencyList
        optionsQuery={optionsData}
        filterOptionsSkillCategory={SkillCategory.Technical}
        listItems={skillProficiencies}
        onEdit={handleEditSkillProficiency}
        onRemove={handleRemoveSkillProficiency}
        onAdd={handleAddSkillProficiency}
        noToast
        withLevel={true}
        customAddText={intl.formatMessage({
          defaultMessage: "Add an essential technical skill",
          id: "clhLJd",
          description: "Button to add an essential technical skill",
        })}
      />
      <div>
        <Checkbox
          id="isEssentialTechnicalSkillsNoteRequired"
          name="isEssentialTechnicalSkillsNoteRequired"
          label={intl.formatMessage(
            jobPosterTemplateMessages.specialNoteIsRequired,
          )}
          boundingBox
          boundingBoxLabel={intl.formatMessage(
            jobPosterTemplateMessages.specialNoteEssentialTechnicalSkills,
          )}
        />
      </div>
      {watchIsNoteRequired ? (
        <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2">
          <div>
            <TextArea
              id="essentialTechnicalSkillsNotesEn"
              name="essentialTechnicalSkillsNotesEn"
              wordLimit={specialNoteWordCountLimits.en}
              label={intl.formatMessage(jobPosterTemplateMessages.specialNote)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              appendLanguageToLabel="en"
            />
          </div>
          <div>
            <TextArea
              id="essentialTechnicalSkillsNotesFr"
              name="essentialTechnicalSkillsNotesFr"
              wordLimit={specialNoteWordCountLimits.fr}
              label={intl.formatMessage(jobPosterTemplateMessages.specialNote)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              appendLanguageToLabel="fr"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EssentialTechnicalSkillsForm;
