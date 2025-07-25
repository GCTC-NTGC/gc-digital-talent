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
  UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment,
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

import EssentialBehaviouralSkillsForm, {
  FormValues,
} from "../../../components/EssentialBehaviouralSkillsForm";
import Display from "./Display";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";
import { isEssentialBehaviouralSkill } from "../../utils";

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
    ...JobPosterTemplateEssentialBehaviouralSkillsFormOptions
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

const initialDataToFormValues = ({
  jobPosterTemplateSkills,
  essentialBehaviouralSkillsNotes,
}: UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment): FormValues => {
  const formValues = {
    essentialBehaviouralSkillProficiencies:
      unpackMaybes(jobPosterTemplateSkills)
        .filter(isEssentialBehaviouralSkill)
        .map<SkillProficiencyListItem>(({ skill, requiredLevel }) => ({
          skillId: skill?.id ?? "", // the above filter should prevent this
          skillName: skill?.name.localized ?? null,
          skillLevel: requiredLevel?.value ?? null,
          skillDefinition: skill?.description?.localized ?? null,
          skillCategory: skill?.category.value ?? null,
        })) ?? [],
    isEssentialBehaviouralSkillsNoteRequired:
      !!essentialBehaviouralSkillsNotes?.en ||
      !!essentialBehaviouralSkillsNotes?.fr,
    essentialBehaviouralSkillsNotesEn:
      essentialBehaviouralSkillsNotes?.en ?? null,
    essentialBehaviouralSkillsNotesFr:
      essentialBehaviouralSkillsNotes?.fr ?? null,
  };

  formValues.essentialBehaviouralSkillProficiencies = sortBy(
    formValues.essentialBehaviouralSkillProficiencies,
    (sp) => sp.skillName,
  );

  return formValues;
};

const formValuesToMutationInput = (
  id: Scalars["UUID"]["input"],
  {
    essentialBehaviouralSkillProficiencies,
    essentialBehaviouralSkillsNotesEn,
    essentialBehaviouralSkillsNotesFr,
  }: FormValues,
  initialSkillProficiencies: UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment["jobPosterTemplateSkills"],
): UpdateJobPosterTemplateInput => {
  // remove all the existing job poster template skills for essential behavioural so we can readd them
  const pivotIdsToDelete =
    initialSkillProficiencies
      ?.filter(isEssentialBehaviouralSkill)
      .map((p) => p.id)
      .filter(notEmpty) ?? [];

  // recreate all the skills of this type
  const newJobPosterTemplateSkills = unpackMaybes(
    essentialBehaviouralSkillProficiencies,
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
      en: essentialBehaviouralSkillsNotesEn,
      fr: essentialBehaviouralSkillsNotesFr,
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
              <EssentialBehaviouralSkillsForm optionsQuery={optionsData} />
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
