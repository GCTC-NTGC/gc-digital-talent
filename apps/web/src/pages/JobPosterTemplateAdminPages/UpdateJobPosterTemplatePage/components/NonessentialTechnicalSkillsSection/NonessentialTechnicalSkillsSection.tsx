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
  UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment,
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

import NonessentialTechnicalSkillsForm, {
  FormValues,
} from "../../../components/NonessentialTechnicalSkillsForm";
import Display from "./Display";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";
import { isNonessentialTechnicalSkill } from "../../utils";

export const InitialData_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateNonessentialTechnicalSkills on JobPosterTemplate {
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
      }
    }
    nonessentialTechnicalSkillsNotes {
      en
      fr
      localized
    }
  }
`);

const Options_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateNonessentialTechnicalSkillsOptions on Query {
    ...JobPosterTemplateNonessentialTechnicalSkillsFormOptions
  }
`);

const UpdateJobPosterTemplateNonessentialTechnicalSkills_Mutation = graphql(
  /* GraphQL */ `
    mutation UpdateJobPosterTemplateNonessentialTechnicalSkills(
      $jobPosterTemplate: UpdateJobPosterTemplateInput!
    ) {
      updateJobPosterTemplate(jobPosterTemplate: $jobPosterTemplate) {
        id
      }
    }
  `,
);

const initialDataToFormValues = ({
  id,
  jobPosterTemplateSkills,
  nonessentialTechnicalSkillsNotes,
}: UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment): FormValues => {
  const formValues = {
    id: id,
    nonessentialTechnicalSkillProficiencies:
      unpackMaybes(jobPosterTemplateSkills)
        .filter(isNonessentialTechnicalSkill)
        .map<SkillProficiencyListItem>(({ skill, requiredLevel }) => ({
          skillId: skill?.id ?? "", // the above filter should prevent this
          skillName: skill?.name.localized ?? null,
          skillLevel: requiredLevel?.value ?? null,
          skillDefinition: skill?.description?.localized ?? null,
          skillCategory: skill?.category.value ?? null,
        })) ?? [],
    isNonessentialTechnicalSkillsNoteRequired:
      !!nonessentialTechnicalSkillsNotes?.en ||
      !!nonessentialTechnicalSkillsNotes?.fr,
    nonessentialTechnicalSkillsNotesEn:
      nonessentialTechnicalSkillsNotes?.en ?? null,
    nonessentialTechnicalSkillsNotesFr:
      nonessentialTechnicalSkillsNotes?.fr ?? null,
  };

  formValues.nonessentialTechnicalSkillProficiencies = sortBy(
    formValues.nonessentialTechnicalSkillProficiencies,
    (sp) => sp.skillName,
  );

  return formValues;
};

const formValuesToMutationInput = (
  id: Scalars["UUID"]["input"],
  {
    nonessentialTechnicalSkillProficiencies,
    nonessentialTechnicalSkillsNotesEn,
    nonessentialTechnicalSkillsNotesFr,
  }: FormValues,
  initialSkillProficiencies: UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment["jobPosterTemplateSkills"],
): UpdateJobPosterTemplateInput => {
  // remove all the existing job poster template skills for nonessential technical so we can readd them
  const pivotIdsToDelete =
    initialSkillProficiencies
      ?.filter(isNonessentialTechnicalSkill)
      .map((p) => p.id)
      .filter(notEmpty) ?? [];

  // recreate all the skills of this type
  const newJobPosterTemplateSkills = unpackMaybes(
    nonessentialTechnicalSkillProficiencies,
  ).map<CreateJobPosterTemplateSkillInput>((p) => ({
    skillId: p.skillId,
    type: PoolSkillType.Nonessential,
    requiredLevel: p.skillLevel,
  }));

  const jobPosterTemplateSkillsInput: UpdateJobPosterTemplateSkillsInput = {
    create: newJobPosterTemplateSkills,
    delete: pivotIdsToDelete,
  };

  return {
    id: id,
    jobPosterTemplateSkills: jobPosterTemplateSkillsInput,
    nonessentialTechnicalSkillsNotes: {
      en: nonessentialTechnicalSkillsNotesEn,
      fr: nonessentialTechnicalSkillsNotesFr,
    },
  };
};

interface NonessentialTechnicalSkillsSectionProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const NonessentialTechnicalSkillsSection = ({
  initialDataQuery,
  optionsQuery,
}: NonessentialTechnicalSkillsSectionProps) => {
  const intl = useIntl();

  const [{ fetching }, executeMutation] = useMutation(
    UpdateJobPosterTemplateNonessentialTechnicalSkills_Mutation,
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
        defaultMessage: "Failed updating asset technical skills",
        id: "wBSuFG",
        description:
          "Message displayed when a user fails to update the nonessential technical skills",
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
              defaultMessage: "Asset technical skills updated successfully!",
              id: "IFNjtT",
              description:
                "Message displayed when a user successfully updates the nonessential technical skills",
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
          defaultMessage: "Edit asset technical skills",
          id: "Vx/Cu9",
          description: "Trigger to edit the nonessential technical skills",
        })}
      </Trigger>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              displayMode={["content"]}
              content={intl.formatMessage({
                defaultMessage: `This section hasn't been completed yet. Use the "Edit asset technical skills" button to get started.`,
                id: "EBgJ5I",
                description:
                  "Null message for nonessential technical skills form",
              })}
            />
          ) : (
            <Display initialDataQuery={initialDataQuery} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <NonessentialTechnicalSkillsForm optionsQuery={optionsData} />
              <CardSeparator decorative orientation="horizontal" />
              <div className="flex flex-wrap items-center gap-6">
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Save asset technical skills",
                    id: "7Q6mMp",
                    description:
                      "Text on a button to save the nonessential technical skills form",
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

export default NonessentialTechnicalSkillsSection;
