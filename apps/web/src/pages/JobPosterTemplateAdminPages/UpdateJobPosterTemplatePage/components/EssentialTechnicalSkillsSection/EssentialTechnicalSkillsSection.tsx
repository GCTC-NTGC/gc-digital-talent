import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";
import sortBy from "lodash/sortBy";

import { Button, CardSeparator, ToggleSection } from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  UpdateJobPosterTemplateInput,
  UpdateJobPosterTemplateEssentialTechnicalSkillsFragment,
  PoolSkillType,
  CreateJobPosterTemplateSkillInput,
  UpdateJobPosterTemplateSkillsInput,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import Trigger from "~/components/ToggleForm/Trigger";
import { ListItem as SkillProficiencyListItem } from "~/components/SkillProficiencyList/SkillProficiencyList";

import EssentialTechnicalSkillsForm, {
  FormValues,
} from "../../../components/EssentialTechnicalSkillsForm";
import Display from "./Display";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";
import { isEssentialTechnicalSkill } from "../../utils";

export const InitialData_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateEssentialTechnicalSkills on JobPosterTemplate {
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
    essentialTechnicalSkillsNotes {
      en
      fr
      localized
    }
  }
`);

const Options_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateEssentialTechnicalSkillsOptions on Query {
    ...JobPosterTemplateEssentialTechnicalSkillsFormOptions
  }
`);

const UpdateJobPosterTemplateEssentialTechnicalSkills_Mutation = graphql(
  /* GraphQL */ `
    mutation UpdateJobPosterTemplateEssentialTechnicalSkills(
      $jobPosterTemplate: UpdateJobPosterTemplateInput!
    ) {
      updateJobPosterTemplate(jobPosterTemplate: $jobPosterTemplate) {
        id
      }
    }
  `,
);

const initialDataToFormValues = ({
  jobPosterTemplateSkills,
  essentialTechnicalSkillsNotes,
}: UpdateJobPosterTemplateEssentialTechnicalSkillsFragment): FormValues => {
  const formValues = {
    essentialTechnicalSkillProficiencies:
      unpackMaybes(jobPosterTemplateSkills)
        .filter(isEssentialTechnicalSkill)
        .map<SkillProficiencyListItem>(({ skill, requiredLevel }) => ({
          skillId: skill?.id ?? "", // the above filter should prevent this
          skillName: skill?.name.localized ?? null,
          skillLevel: requiredLevel?.value ?? null,
          skillDefinition: skill?.description?.localized ?? null,
          skillCategory: skill?.category.value ?? null,
        })) ?? [],
    isEssentialTechnicalSkillsNoteRequired:
      !!essentialTechnicalSkillsNotes?.en ||
      !!essentialTechnicalSkillsNotes?.fr,
    essentialTechnicalSkillsNotesEn: essentialTechnicalSkillsNotes?.en ?? null,
    essentialTechnicalSkillsNotesFr: essentialTechnicalSkillsNotes?.fr ?? null,
  };

  formValues.essentialTechnicalSkillProficiencies = sortBy(
    formValues.essentialTechnicalSkillProficiencies,
    (sp) => sp.skillName,
  );

  return formValues;
};

const formValuesToMutationInput = (
  id: Scalars["UUID"]["input"],
  {
    essentialTechnicalSkillProficiencies,
    essentialTechnicalSkillsNotesEn,
    essentialTechnicalSkillsNotesFr,
  }: FormValues,
  initialSkillProficiencies: UpdateJobPosterTemplateEssentialTechnicalSkillsFragment["jobPosterTemplateSkills"],
): UpdateJobPosterTemplateInput => {
  // remove all the existing job poster template skills for essential technical so we can readd them
  const pivotIdsToDelete =
    initialSkillProficiencies
      ?.filter(isEssentialTechnicalSkill)
      .map((p) => p.id)
      .filter(notEmpty) ?? [];

  // recreate all the skills of this type
  const newJobPosterTemplateSkills = unpackMaybes(
    essentialTechnicalSkillProficiencies,
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
    essentialTechnicalSkillsNotes: {
      en: essentialTechnicalSkillsNotesEn,
      fr: essentialTechnicalSkillsNotesFr,
    },
  };
};

interface EssentialTechnicalSkillsSectionProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const EssentialTechnicalSkillsSection = ({
  initialDataQuery,
  optionsQuery,
}: EssentialTechnicalSkillsSectionProps) => {
  const intl = useIntl();

  const [{ fetching }, executeMutation] = useMutation(
    UpdateJobPosterTemplateEssentialTechnicalSkills_Mutation,
  );

  const initialData = getFragment(InitialData_Fragment, initialDataQuery);

  const optionsData = getFragment(Options_Fragment, optionsQuery);

  const isNull = hasAllEmptyFields(initialData);
  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasEmptyRequiredFields(initialData),
    fallbackIcon: QuestionMarkCircleIcon,
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed updating essential technical skills",
        id: "wvFWrX",
        description:
          "Message displayed when a user fails to update the essential technical skills",
      }),
    );
  };

  const initialFormValues = initialDataToFormValues(initialData);
  const methods = useForm<FormValues>({
    defaultValues: initialFormValues,
  });
  const { handleSubmit, reset: resetForm } = methods;

  const handleOpenChange = (open: boolean) => {
    resetForm(initialFormValues);
    setIsEditing(open);
  };

  const handleSave: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const mutationInput = formValuesToMutationInput(
      initialData.id,
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
                "Essential technical skills updated successfully!",
              id: "Nc751o",
              description:
                "Message displayed when a user successfully updates the essential technical skills",
            }),
          );
          setIsEditing(false);
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <ToggleSection.Root open={isEditing} onOpenChange={handleOpenChange}>
      <Trigger className="flex flex-row justify-end">
        {intl.formatMessage({
          defaultMessage: "Edit essential technical skills",
          id: "mLuEdp",
          description: "Trigger to edit the essential technical skills",
        })}
      </Trigger>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              displayMode={["content"]}
              content={intl.formatMessage({
                defaultMessage: `This section hasn't been completed yet. Use the "Edit essential technical skills" button to get started.`,
                id: "DgjyfI",
                description: "Null message for essential technical skills form",
              })}
            />
          ) : (
            <Display initialDataQuery={initialDataQuery} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <EssentialTechnicalSkillsForm optionsQuery={optionsData} />
              <CardSeparator decorative orientation="horizontal" />
              <div className="flex flex-wrap items-center gap-6">
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Save essential technical skills",
                    id: "vZ7n91",
                    description:
                      "Text on a button to save the essential technical skills form",
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

export default EssentialTechnicalSkillsSection;
