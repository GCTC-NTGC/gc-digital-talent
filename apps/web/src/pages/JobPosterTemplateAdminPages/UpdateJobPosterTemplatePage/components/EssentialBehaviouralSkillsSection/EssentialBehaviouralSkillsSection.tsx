import { useIntl } from "react-intl";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";
import { useEffect } from "react";
import sortBy from "lodash/sortBy";

import { Button, CardSeparator, ToggleSection } from "@gc-digital-talent/ui";
import { Checkbox, Submit, TextArea } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  Locales,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  UpdateJobPosterTemplateInput,
  UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment,
  SkillCategory,
  PoolSkillType,
  CreateJobPosterTemplateSkillInput,
  UpdateJobPosterTemplateSkillsInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import Trigger from "~/components/ToggleForm/Trigger";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import SkillProficiencyList, {
  ListItem as SkillProficiencyListItem,
  SkillProficiencyListProps,
} from "~/components/SkillProficiencyList/SkillProficiencyList";

import Display from "./Display";
import { labels } from "../../labels";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";
import {
  isEssentialBehaviouralSkill,
  insertionIndexBySkillName,
} from "../../utils";

const TEXT_AREA_MAX_WORDS_EN = 100;

const specialNoteWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

export const InitialData_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateEssentialBehaviouralSkills on JobPosterTemplate {
    id
    jobPosterTemplateSkills {
      id
      skill {
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
      type {
        value
      }
      requiredLevel {
        value
        label {
          localized
        }
      }
    }
    essentialBehaviouralSkillsNotes {
      en
      fr
      localized
    }
  }
`);

const Options_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateEssentialBehaviouralSkillsOptions on Query {
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

const UpdateJobPosterTemplateEssentialBehaviouralSkills_Mutation = graphql(
  /* GraphQL */ `
    mutation UpdateJobPosterTemplateEssentialBehaviouralSkills(
      $jobPosterTemplate: UpdateJobPosterTemplateInput!
    ) {
      updateJobPosterTemplate(jobPosterTemplate: $jobPosterTemplate) {
        id
      }
    }
  `,
);

export interface FormValues {
  id: string | null;
  skillProficiencies: SkillProficiencyListItem[] | null;
  isSpecialNoteRequired: boolean | null;
  specialNoteEn: string | null;
  specialNoteFr: string | null;
}

const initialDataToFormValues = ({
  id,
  jobPosterTemplateSkills,
  essentialBehaviouralSkillsNotes,
}: UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment): FormValues => {
  const formValues = {
    id: id,
    skillProficiencies:
      unpackMaybes(jobPosterTemplateSkills)
        .filter(isEssentialBehaviouralSkill)
        .map<SkillProficiencyListItem>(({ skill, requiredLevel }) => ({
          skillId: skill?.id ?? "", // the above filter should prevent this
          skillName: skill?.name.localized ?? null,
          skillLevel: requiredLevel?.value ?? null,
          skillDefinition: skill?.description?.localized ?? null,
          skillCategory: skill?.category.value ?? null,
        })) ?? [],
    isSpecialNoteRequired:
      !!essentialBehaviouralSkillsNotes?.en ||
      !!essentialBehaviouralSkillsNotes?.fr,
    specialNoteEn: essentialBehaviouralSkillsNotes?.en ?? null,
    specialNoteFr: essentialBehaviouralSkillsNotes?.fr ?? null,
  };

  formValues.skillProficiencies = sortBy(
    formValues.skillProficiencies,
    (sp) => sp.skillName,
  );

  return formValues;
};

const formValuesToMutationInput = (
  { id, skillProficiencies, specialNoteEn, specialNoteFr }: FormValues,
  initialSkillProficiencies: UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment["jobPosterTemplateSkills"],
): UpdateJobPosterTemplateInput => {
  if (!id) {
    throw new Error("Can not submit without an ID"); // should not be possible
  }

  // remove all the existing job poster template skills for essential behavioural so we can readd them
  const pivotIdsToDelete =
    initialSkillProficiencies
      ?.filter(isEssentialBehaviouralSkill)
      .map((p) => p.id)
      .filter(notEmpty) ?? [];

  // recreate all the skills of this type
  const newJobPosterTemplateSkills = unpackMaybes(
    skillProficiencies,
  ).map<CreateJobPosterTemplateSkillInput>((p) => ({
    skillId: p.skillId,
    type: PoolSkillType.Essential,
    requiredLevel: p.skillLevel,
  }));

  const jobPosterTemplateSkillsInput: UpdateJobPosterTemplateSkillsInput = {
    create: newJobPosterTemplateSkills,
    delete: pivotIdsToDelete,
  };

  return {
    id: id,
    jobPosterTemplateSkills: jobPosterTemplateSkillsInput,
    essentialBehaviouralSkillsNotes: {
      en: specialNoteEn,
      fr: specialNoteFr,
    },
  };
};

interface EssentialBehaviouralSkillsSectionProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const EssentialBehaviouralSkillsSection = ({
  initialDataQuery,
  optionsQuery,
}: EssentialBehaviouralSkillsSectionProps) => {
  const intl = useIntl();

  const [{ fetching }, executeMutation] = useMutation(
    UpdateJobPosterTemplateEssentialBehaviouralSkills_Mutation,
  );

  const initialData = getFragment(InitialData_Fragment, initialDataQuery);

  const optionsData = getFragment(Options_Fragment, optionsQuery);
  const allSkills = unpackMaybes(optionsData.skills);

  const isNull = hasAllEmptyFields(initialData);
  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasEmptyRequiredFields(initialData),
    fallbackIcon: QuestionMarkCircleIcon,
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed updating essential behavioural skills",
        id: "twNn98",
        description:
          "Message displayed when a user fails to update the essential behavioural skills",
      }),
    );
  };

  const initialFormValues = initialDataToFormValues(initialData);
  const methods = useForm<FormValues>({
    defaultValues: initialFormValues,
  });
  const {
    control,
    watch,
    handleSubmit,
    resetField,
    setValue,
    reset: resetForm,
  } = methods;

  const watchIsSpecialNoteRequired = watch("isSpecialNoteRequired");

  const {
    fields: skillProficiencies,
    insert: insertIntoSkillProficiencies,
    remove: removeFromSkillProficiencies,
    update: updateSkillProficiency,
  } = useFieldArray({
    control,
    name: "skillProficiencies",
  });

  const handleOpenChange = (open: boolean) => {
    resetForm(initialFormValues);
    setIsEditing(open);
  };

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  useEffect(() => {
    if (watchIsSpecialNoteRequired) {
      resetField("specialNoteEn");
      resetField("specialNoteFr");
    } else {
      setValue("specialNoteEn", null);
      setValue("specialNoteFr", null);
    }
  }, [resetField, setValue, watchIsSpecialNoteRequired]);

  const handleSave: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const mutationInput = formValuesToMutationInput(
      formValues,
      initialData.jobPosterTemplateSkills,
    );

    return executeMutation({
      jobPosterTemplate: mutationInput,
    })
      .then((result) => {
        if (result.data?.updateJobPosterTemplate) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Essential behavioural skills updated successfully!",
              id: "xfKbJ1",
              description:
                "Message displayed when a user successfully updates the essential behavioural skills",
            }),
          );
          setIsEditing(false);
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

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
    <ToggleSection.Root open={isEditing} onOpenChange={handleOpenChange}>
      <Trigger className="flex flex-row justify-end">
        {intl.formatMessage({
          defaultMessage: "Edit essential behavioural skills",
          id: "YFRIVD",
          description: "Trigger to edit the essential behavioural skills",
        })}
      </Trigger>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              displayMode={["content"]}
              content={intl.formatMessage({
                defaultMessage: `This section hasn't been completed yet. Use the "Edit essential behavioural skills" button to get started.`,
                id: "814M74",
                description:
                  "Null message for essential behavioural skills form",
              })}
            />
          ) : (
            <Display initialDataQuery={initialDataQuery} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
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
                    id="isSpecialNoteRequired"
                    name="isSpecialNoteRequired"
                    label={intl.formatMessage(labels.specialNoteIsRequired)}
                    boundingBox
                    boundingBoxLabel={intl.formatMessage(
                      labels.specialNoteEssentialBehaviouralSkills,
                    )}
                  />
                </div>
                {watchIsSpecialNoteRequired ? (
                  <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2">
                    <div>
                      <TextArea
                        id="specialNoteEn"
                        name="specialNoteEn"
                        wordLimit={specialNoteWordCountLimits.en}
                        label={intl.formatMessage(labels.specialNoteEn)}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                    </div>
                    <div>
                      <TextArea
                        id="specialNoteFr"
                        name="specialNoteFr"
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
              <CardSeparator decorative orientation="horizontal" />
              <div className="flex flex-wrap items-center gap-6">
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Save essential behavioural skills",
                    id: "9x/cle",
                    description:
                      "Text on a button to save the essential behavioural skills form",
                  })}
                  color="primary"
                  mode="solid"
                  isSubmitting={fetching}
                />
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </div>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default EssentialBehaviouralSkillsSection;
