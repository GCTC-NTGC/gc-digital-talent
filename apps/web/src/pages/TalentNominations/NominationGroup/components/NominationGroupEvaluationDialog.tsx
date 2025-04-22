import { defineMessage, useIntl } from "react-intl";
import { useState } from "react";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Button, Dialog, Heading, Separator } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { RadioGroup } from "@gc-digital-talent/forms";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import talentNominationMessages from "../../../../messages/talentNominationMessages";

const dialogTitle = defineMessage({
  defaultMessage: "Submit the evaluation of this nomination",
  id: "3I3F9y",
  description: "Title for dialog to evaluate a nomination group",
});

const dialogSubtitle = defineMessage({
  defaultMessage:
    "Record the decision on whether this nomination has been approved for talent management.",
  id: "po01Az",
  description: "Subtitle for dialog to evaluate a nomination group",
});

const NominationGroupEvaluationDialog_Fragment = graphql(/* GraphQL */ `
  fragment NominationGroupEvaluationDialog on TalentNominationGroup {
    id
    nominee {
      firstName
    }
    nominations {
      nominateForAdvancement
      advancementReference {
        workEmail
      }
      advancementReferenceFallbackWorkEmail
    }
    advancementNominationCount
    lateralMovementNominationCount
    developmentProgramsNominationCount
  }
`);

interface FormValues {
  offPlatformRecruitmentProcesses: string | null | undefined;
}

interface NominationGroupEvaluationDialogProps {
  triggerButtonColor: string;
  talentNominationGroupQuery: FragmentType<
    typeof NominationGroupEvaluationDialog_Fragment
  >;
}

const NominationGroupEvaluationDialog = ({
  triggerButtonColor,
  talentNominationGroupQuery,
}: NominationGroupEvaluationDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(true);
  const methods = useForm<FormValues>({
    defaultValues: {
      offPlatformRecruitmentProcesses: "x",
    },
  });

  const talentNominationGroup = getFragment(
    NominationGroupEvaluationDialog_Fragment,
    talentNominationGroupQuery,
  );

  const isNominatedForAdvancement =
    talentNominationGroup?.advancementNominationCount;
  const isNominatedForLateralMovement =
    talentNominationGroup?.lateralMovementNominationCount;
  const isNominatedForDevelopmentPrograms =
    talentNominationGroup?.developmentProgramsNominationCount;

  const nominations = talentNominationGroup.nominations ?? [];

  const advancementReferenceWorkEmails = nominations
    .filter((n) => n.nominateForAdvancement)
    .map(
      (n) =>
        n.advancementReference?.workEmail ??
        n.advancementReferenceFallbackWorkEmail,
    )
    .filter(notEmpty)
    .join(", ");

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    return Promise.resolve();
    // await requestMutation(userId, {
    //   offPlatformRecruitmentProcesses:
    //     formValues.offPlatformRecruitmentProcesses ?? null,
    // })
    //   .then(() => {
    //     toast.success(
    //       intl.formatMessage(commonMessages.accountUpdateSuccessful),
    //     );
    //     setOpen(false);
    //   })
    //   .catch(() => {
    //     toast.error(intl.formatMessage(commonMessages.accountUpdateFailed));
    //   });
  };
  const { handleSubmit } = methods;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          data-h2-margin-top="base(x.1)"
          data-h2-color={triggerButtonColor}
          icon={PencilSquareIcon}
          mode={"icon_only"}
          fontSize="h4"
          aria-label={intl.formatMessage(dialogTitle)}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={intl.formatMessage(dialogSubtitle)}>
          {intl.formatMessage(dialogTitle)}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
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
                      id: "aZN5v9",
                      description:
                        "Introduction for for dialog to evaluate a nomination group",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "{nomineeName} has been nominated for: ",
                        id: "SG6Kuf",
                        description:
                          "Introduction for for dialog to evaluate a nomination group",
                      },
                      {
                        nomineeName: talentNominationGroup.nominee?.firstName,
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
                    <Separator data-h2-margin="base(0)" />
                    <div
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x1)"
                    >
                      <Heading
                        level="h3"
                        size="h6"
                        data-h2-margin="base(0)"
                        data-h2-font-weight="base(normal)"
                      >
                        {intl.formatMessage({
                          defaultMessage: "Nomination for advancement",
                          id: "5qopVO",
                          description:
                            "heading for advancement nomination section",
                        })}
                      </Heading>
                      <FieldDisplay
                        label={intl.formatMessage({
                          defaultMessage: "Reference’s work email",
                          id: "aqlXBz",
                          description: "Reference work email field",
                        })}
                      >
                        {advancementReferenceWorkEmails ||
                          intl.formatMessage(commonMessages.notFound)}
                      </FieldDisplay>
                      <RadioGroup
                        idPrefix="nominationForAdvancementDecision"
                        name="nominationForAdvancementDecision"
                        legend={intl.formatMessage({
                          defaultMessage: "Advancement approval",
                          id: "MHQ2RT",
                          description:
                            "Label for an nomination for advancement decision",
                        })}
                        items={[
                          {
                            value: "true",
                            label: intl.formatMessage({
                              defaultMessage:
                                "This nomination for advancement is approved.",
                              id: "lgp1Jx",
                              description:
                                "Label for advancement nomination is approved",
                            }),
                          },
                          {
                            value: "false",
                            label: intl.formatMessage({
                              defaultMessage:
                                "This nomination for advancement is not supported.",
                              id: "nG1cQZ",
                              description:
                                "Label for advancement nomination is not approved",
                            }),
                          },
                        ]}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                    </div>
                  </>
                ) : null}
                {isNominatedForLateralMovement ? (
                  <>
                    <Separator data-h2-margin="base(0)" />
                    <div>lateral movement section</div>
                  </>
                ) : null}
                {isNominatedForDevelopmentPrograms ? (
                  <>
                    <Separator data-h2-margin="base(0)" />
                    <div>development programs section</div>
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
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationGroupEvaluationDialog;
