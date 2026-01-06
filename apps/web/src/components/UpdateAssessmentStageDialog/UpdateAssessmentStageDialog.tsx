import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import {
  AssessmentStepType,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  ScreeningStage,
} from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Select } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import applicationMessages from "~/messages/applicationMessages";

import { FormValues } from "./types";

const hiddenSteps = [
  AssessmentStepType.ApplicationScreening,
  AssessmentStepType.ScreeningQuestionsAtApplication,
  null,
];

function getStepLabel(
  title?: Maybe<string>,
  typeLocalized?: Maybe<string>,
  order?: Maybe<number>,
): string | null {
  if (!title && !typeLocalized) {
    return null;
  }

  // should always be defined if reaching this point, second nullish coalesce is for TypeScript
  const name = title ?? typeLocalized ?? "";

  if (order && name) {
    return `${order}. ${name}`;
  }

  return name;
}

const UpdateAssessmentStageDialog_Fragment = graphql(/** GraphQL */ `
  fragment UpdateAssessmentStageDialog on PoolCandidate {
    id
    screeningStage {
      value
    }
    assessmentStep {
      id
      sortOrder
      title {
        localized
      }
    }

    pool {
      assessmentSteps {
        id
        sortOrder
        type {
          value
          label {
            localized
          }
        }
        title {
          localized
        }
      }
    }
  }
`);

const UpdateAssessmentStage_Mutation = graphql(/** GraphQL */ `
  mutation UpdateAssessmentStage(
    $input: UpdatePoolCandidateScreeningStageInput!
  ) {
    updatePoolCandidateScreeningStage(poolCandidate: $input) {
      id
    }
  }
`);

interface AssessmentStageDialogProps {
  trigger?: ReactNode;
  query: FragmentType<typeof UpdateAssessmentStageDialog_Fragment>;
}

const UpdateAssessmentStageDialog = ({
  trigger,
  query,
}: AssessmentStageDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const candidate = getFragment(UpdateAssessmentStageDialog_Fragment, query);
  const [{ fetching: mutating }, executeMutation] = useMutation(
    UpdateAssessmentStage_Mutation,
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const steps = unpackMaybes(candidate.pool.assessmentSteps).filter(
    (s) => !hiddenSteps.includes(s.type?.value ?? null),
  );
  let defaultStep =
    steps.findIndex((step) => step.id === candidate.assessmentStep?.id) ?? 0;
  if (defaultStep < 0) defaultStep = 0;

  const label =
    getStepLabel(
      steps[defaultStep]?.title?.localized,
      steps[defaultStep]?.type?.label?.localized,
      defaultStep + 1,
    ) ?? notAvailable;

  const methods = useForm<FormValues>({
    defaultValues: {
      assessmentStep: steps[defaultStep]?.id ?? null,
    },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update assessment stage",
        id: "MkA+x0",
        description: "Error message for updating a candidates assessment stage",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (mutating) return;

    await executeMutation({
      input: {
        id: candidate.id,
        screeningStage:
          candidate?.screeningStage?.value ?? ScreeningStage.UnderAssessment,
        assessmentStep: { connect: values.assessmentStep },
      },
    })
      .then((res) => {
        if (!res.data?.updatePoolCandidateScreeningStage?.id || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Candidate assessment stage updated successfully",
            id: "Ob6yEb",
            description:
              "Success message for updating a candidates assessment stage",
          }),
        );
        setIsOpen(false);
      })
      .catch(handleError);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        {trigger ?? (
          <Button mode="inline" className="font-normal">
            {label}
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Manage the step this candidate is at in the assessment plan.",
            id: "u8O+is",
            description:
              "Subtitle for form to update a candidates assessment stage",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Change assessment stage",
            id: "13WmnE",
            description:
              "Heading for form to update a candidates assessment stage",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Select
                id="assessmentStep"
                name="assessmentStep"
                label={intl.formatMessage(applicationMessages.assessmentStage)}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                nullSelection={intl.formatMessage(
                  uiMessages.nullSelectionOption,
                )}
                options={steps.map(({ id, title, type }, index) => ({
                  value: id,
                  label:
                    getStepLabel(
                      title?.localized,
                      type?.label?.localized,
                      index + 1,
                    ) ?? notAvailable,
                }))}
              />
              <Dialog.Footer>
                <Button type="submit">
                  {intl.formatMessage(commonMessages.saveAndContinue)}
                </Button>
                <Dialog.Close>
                  <Button mode="inline" color="warning">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UpdateAssessmentStageDialog;
