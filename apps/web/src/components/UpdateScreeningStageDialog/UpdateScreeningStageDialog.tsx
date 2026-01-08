import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  ScreeningStage,
} from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  errorMessages,
  formMessages,
  narrowEnumType,
  sortLocalizedEnumOptions,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Select } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getScreeningStageIndex } from "~/utils/poolCandidate";
import applicationMessages from "~/messages/applicationMessages";

import { FormValues } from "./types";
import CandidateFacingScreeningStageNotice from "./CandidateFacingScreeningStageNotice";
import MoveToPreviousStepNotice from "./MoveToPreviousStepNotice";

const UpdateScreeningStageDialog_Fragment = graphql(/** GraphQL */ `
  fragment UpdateScreeningStageDialog on PoolCandidate {
    id
    screeningStage {
      value
      label {
        localized
      }
    }
  }
`);

const UpdateScreeningStageDialogOptions_Query = graphql(/** GraphQL */ `
  query UpdateScreeningStageDialogOptions {
    screeningStages: localizedEnumOptions(enumName: "ScreeningStage") {
      ... on LocalizedScreeningStage {
        value
        label {
          localized
        }
      }
    }
  }
`);

const UpdateScreeningStage_Mutation = graphql(/** GraphQL */ `
  mutation UpdateScreeningStage(
    $input: UpdatePoolCandidateScreeningStageInput!
  ) {
    updatePoolCandidateScreeningStage(poolCandidate: $input) {
      id
    }
  }
`);

interface ScreeningStageDialogProps {
  trigger?: ReactNode;
  query: FragmentType<typeof UpdateScreeningStageDialog_Fragment>;
}

const UpdateScreeningStageDialog = ({
  trigger,
  query,
}: ScreeningStageDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const candidate = getFragment(UpdateScreeningStageDialog_Fragment, query);
  const [{ data }] = useQuery({
    query: UpdateScreeningStageDialogOptions_Query,
  });
  const [{ fetching: mutating }, executeMutation] = useMutation(
    UpdateScreeningStage_Mutation,
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const idx = getScreeningStageIndex(candidate.screeningStage?.value);
  let label = candidate.screeningStage?.label.localized ?? notAvailable;
  if (idx) {
    label = `${idx}. ${label}`;
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      screeningStage:
        candidate?.screeningStage?.value ?? ScreeningStage.NewApplication,
    },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update screening stage",
        id: "y02UlU",
        description: "Error message for updating a candidates screening stage",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (mutating) return;

    await executeMutation({
      input: { id: candidate.id, screeningStage: values.screeningStage },
    })
      .then((res) => {
        if (!res.data?.updatePoolCandidateScreeningStage?.id || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Candidate screening stage updated successfully",
            id: "nl2Trd",
            description:
              "Success message for updating a candidates screening stage",
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
              "Manage the step this candidate is at in the screening stage.",
            id: "GL8a4q",
            description:
              "Subtitle for form to update a candidates screening stage",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Change screening stage",
            id: "APBv6h",
            description:
              "Heading for form to update a candidates screening stage",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Select
                id="screeningStage"
                name="screeningStage"
                label={intl.formatMessage(applicationMessages.screeningStage)}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                nullSelection={intl.formatMessage(
                  uiMessages.nullSelectionOption,
                )}
                options={sortLocalizedEnumOptions(
                  ENUM_SORT_ORDER.SCREENING_STAGE,
                  narrowEnumType(
                    unpackMaybes(data?.screeningStages),
                    "ScreeningStage",
                  ),
                ).map((screeningStage, index) => ({
                  value: screeningStage.value,
                  label: `${index + 1}. ${screeningStage.label.localized ?? notAvailable}`,
                }))}
              />
              <MoveToPreviousStepNotice
                screeningStage={candidate?.screeningStage?.value}
              />
              <CandidateFacingScreeningStageNotice />
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

export default UpdateScreeningStageDialog;
