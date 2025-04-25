import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import talentNominationMessages from "~/messages/talentNominationMessages";

import { convertQueryDataToFormData, FormValues } from "../form";
import AdvancementSection from "./AdvancementSection";
import LateralMovementSection from "./LateralMovementSection";
import DevelopmentProgramsSection from "./DevelopmentProgramsSection";

const NominationGroupEvaluationForm_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupEvaluationForm on TalentNominationGroup {
    ...NominationGroupEvaluationDialogAdvancement
    ...NominationGroupEvaluationDialogLateralMovement
    ...NominationGroupEvaluationDialogDevelopmentPrograms
    id

    nominee {
      firstName
    }

    advancementNominationCount
    lateralMovementNominationCount
    developmentProgramsNominationCount

    # for form initialState
    advancementDecision {
      value
    }
    advancementReferenceConfirmed
    advancementNotes
    lateralMovementDecision {
      value
    }
    lateralMovementNotes
    developmentProgramsDecision {
      value
    }
    developmentProgramsNotes
  }
`);

const NominationGroupEvaluationFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupEvaluationFormOptions on Query {
    ...NominationGroupEvaluationDialogLateralMovementOptions
  }
`);

interface NominationGroupEvaluationFormProps {
  onSubmit: SubmitHandler<FormValues>;
  talentNominationGroupQuery: FragmentType<
    typeof NominationGroupEvaluationForm_Fragment
  >;
  talentNominationGroupOptionsQuery: FragmentType<
    typeof NominationGroupEvaluationFormOptions_Fragment
  >;
}

const NominationGroupEvaluationForm = ({
  onSubmit,
  talentNominationGroupQuery,
  talentNominationGroupOptionsQuery,
}: NominationGroupEvaluationFormProps) => {
  const intl = useIntl();

  const talentNominationGroup = getFragment(
    NominationGroupEvaluationForm_Fragment,
    talentNominationGroupQuery,
  );
  const talentNominationGroupOptions = getFragment(
    NominationGroupEvaluationFormOptions_Fragment,
    talentNominationGroupOptionsQuery,
  );

  const methods = useForm<FormValues>({
    defaultValues: convertQueryDataToFormData(talentNominationGroup),
  });
  const { handleSubmit } = methods;

  const isNominatedForAdvancement =
    talentNominationGroup?.advancementNominationCount;
  const isNominatedForLateralMovement =
    talentNominationGroup?.lateralMovementNominationCount;
  const isNominatedForDevelopmentPrograms =
    talentNominationGroup?.developmentProgramsNominationCount;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1.25)"
        >
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x0.5)"
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Ready to submit the evaluation of this nomination? Please complete the form for the selected nomination options.",
                id: "eGlL1Q",
                description:
                  "Introduction for form to evaluate a nomination group",
              })}
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "{nomineeName} has been nominated for: ",
                  id: "OJPiPD",
                  description:
                    "Introduction for list of nomination options for form to evaluate a nomination group",
                },
                {
                  nomineeName: talentNominationGroup?.nominee?.firstName,
                },
              )}
            </p>
            <ul data-h2-margin-bottom="base:children[li:not(:last-child)](x.5)">
              {isNominatedForAdvancement ? (
                <li>
                  {intl.formatMessage(
                    talentNominationMessages.nominateForAdvancement,
                  )}
                </li>
              ) : null}
              {isNominatedForLateralMovement ? (
                <li>
                  {intl.formatMessage(
                    talentNominationMessages.nominateForLateralMovement,
                  )}
                </li>
              ) : null}
              {isNominatedForDevelopmentPrograms ? (
                <li>
                  {intl.formatMessage(
                    talentNominationMessages.nominateForDevelopmentPrograms,
                  )}
                </li>
              ) : null}
            </ul>
          </div>
          {isNominatedForAdvancement ? (
            <>
              <Separator data-h2-margin="base(0)" decorative />
              <AdvancementSection
                talentNominationGroupQuery={talentNominationGroup}
              />
            </>
          ) : null}
          {isNominatedForLateralMovement ? (
            <>
              <Separator data-h2-margin="base(0)" decorative />
              <LateralMovementSection
                talentNominationGroupQuery={talentNominationGroup}
                talentNominationGroupOptionsQuery={talentNominationGroupOptions}
              />
            </>
          ) : null}
          {isNominatedForDevelopmentPrograms ? (
            <>
              <Separator data-h2-margin="base(0)" decorative />
              <DevelopmentProgramsSection
                talentNominationGroupQuery={talentNominationGroup}
              />
            </>
          ) : null}
        </div>
        <Dialog.Footer>
          <Button type="submit" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Submit evaluation",
              id: "g82nk3",
              description: "Button to submit an evaluation form",
            })}
          </Button>
          <Dialog.Close>
            <Button type="button" color="warning" mode="inline">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </form>
    </FormProvider>
  );
};

export default NominationGroupEvaluationForm;
