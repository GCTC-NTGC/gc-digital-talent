import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

import { RadioGroup, RichTextInput } from "@gc-digital-talent/forms";
import { Heading, Ul, Well } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationGroupDecision,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import { formMessages as talentNominationGroupMessages } from "../../NominationGroup/messages";
import { formMessages } from "../messages";
import { FormValues } from "../form";

const NominationGroupEvaluationDialogDevelopmentPrograms_Fragment = graphql(
  /* GraphQL */ `
    fragment NominationGroupEvaluationDialogDevelopmentPrograms on TalentNominationGroup {
      id
      nominations {
        nominateForDevelopmentPrograms
        developmentPrograms {
          id
          name {
            localized
          }
        }
        developmentProgramOptionsOther
      }
      talentNominationEvent {
        developmentPrograms {
          id
          name {
            localized
          }
        }
      }
    }
  `,
);

interface DevelopmentProgramsSectionProps {
  talentNominationGroupQuery: FragmentType<
    typeof NominationGroupEvaluationDialogDevelopmentPrograms_Fragment
  >;
}

const DevelopmentProgramsSection = ({
  talentNominationGroupQuery,
}: DevelopmentProgramsSectionProps) => {
  const intl = useIntl();

  const { watch, resetField } = useFormContext<FormValues>();
  const [selectedDevelopmentProgramsDecision] = watch([
    "developmentProgramsDecision",
  ]);

  useEffect(() => {
    const resetDirtyField = (
      name: keyof FormValues,
      defaultValue: null | string | boolean,
    ) => {
      resetField(name, { keepDirty: false, defaultValue });
    };

    if (
      selectedDevelopmentProgramsDecision !==
      TalentNominationGroupDecision.Approved
    ) {
      resetDirtyField("developmentProgramsApprovedNotes", null);
    }

    if (
      selectedDevelopmentProgramsDecision !==
      TalentNominationGroupDecision.Rejected
    ) {
      resetDirtyField("developmentProgramsRejectedNotes", null);
    }
  }, [resetField, selectedDevelopmentProgramsDecision]);

  const talentNominationGroup = getFragment(
    NominationGroupEvaluationDialogDevelopmentPrograms_Fragment,
    talentNominationGroupQuery,
  );

  const nominations = talentNominationGroup.nominations ?? [];

  const developmentProgramIdsInThisNominationGroup = nominations
    .filter((nomination) => nomination.nominateForDevelopmentPrograms)
    .flatMap((nomination) => nomination.developmentPrograms)
    .map((developmentProgram) => developmentProgram?.id)
    .filter(notEmpty);

  const developmentProgramListItems =
    talentNominationGroup.talentNominationEvent.developmentPrograms?.map(
      (program) => ({
        key: program.id,
        value: developmentProgramIdsInThisNominationGroup.includes(program.id),
        label:
          program.name?.localized ??
          intl.formatMessage(commonMessages.notFound),
      }),
    ) ?? [];

  const otherDevelopmentProgramsInThisNominationGroup = nominations
    .filter((nomination) => nomination.nominateForDevelopmentPrograms)
    .map((nomination) => nomination.developmentProgramOptionsOther)
    .filter(notEmpty);

  // OTHER is not a real development program so we have to add a fake option
  developmentProgramListItems.push({
    key: "OTHER",
    value: otherDevelopmentProgramsInThisNominationGroup.length > 0,
    label: intl.formatMessage(commonMessages.other),
  });

  return (
    <div className="flex flex-col gap-6">
      <Heading level="h3" size="h6" className="m-0 font-normal">
        {intl.formatMessage({
          defaultMessage: "Nomination for development programs",
          id: "9oEgJL",
          description: "heading for development programs nomination section",
        })}
      </Heading>
      <FieldDisplay
        label={intl.formatMessage(
          talentNominationGroupMessages.developmentPrograms,
        )}
      >
        <Ul unStyled space="md">
          {developmentProgramListItems.map((item) => (
            <li key={item.key}>
              <BoolCheckIcon
                value={item.value}
                trueLabel={intl.formatMessage(
                  formMessages.nominationRecommendedTrue,
                )}
                falseLabel={intl.formatMessage(
                  formMessages.nominationRecommendedFalse,
                )}
              >
                {item.label}
              </BoolCheckIcon>
            </li>
          ))}
        </Ul>
      </FieldDisplay>
      {/* only display the OTHER option if it is selected */}
      {otherDevelopmentProgramsInThisNominationGroup.length > 0 ? (
        <FieldDisplay label={intl.formatMessage(commonMessages.other)}>
          <Ul unStyled space="md">
            {otherDevelopmentProgramsInThisNominationGroup.map((item) => (
              <li key={item}>
                <BoolCheckIcon
                  value={true}
                  trueLabel={intl.formatMessage(
                    formMessages.nominationRecommendedTrue,
                  )}
                  falseLabel={intl.formatMessage(
                    formMessages.nominationRecommendedFalse,
                  )}
                >
                  {item}
                </BoolCheckIcon>
              </li>
            ))}
          </Ul>
        </FieldDisplay>
      ) : null}
      <RadioGroup
        idPrefix="developmentProgramsDecision"
        name="developmentProgramsDecision"
        legend={intl.formatMessage(
          formMessages.developmentProgramsNominationDecisionLabel,
        )}
        items={[
          {
            value: TalentNominationGroupDecision.Approved,
            label: intl.formatMessage(
              formMessages.developmentProgramsNominationDecisionApproved,
            ),
          },
          {
            value: TalentNominationGroupDecision.Rejected,
            label: intl.formatMessage(
              formMessages.developmentProgramsNominationDecisionRejected,
            ),
          },
        ]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      {selectedDevelopmentProgramsDecision ==
      TalentNominationGroupDecision.Approved ? (
        <RichTextInput
          id="developmentProgramsApprovedNotes"
          name="developmentProgramsApprovedNotes"
          label={intl.formatMessage(formMessages.approvalNotes)}
        />
      ) : null}
      {selectedDevelopmentProgramsDecision ==
      TalentNominationGroupDecision.Rejected ? (
        <RichTextInput
          id="developmentProgramsRejectedNotes"
          name="developmentProgramsRejectedNotes"
          label={intl.formatMessage(formMessages.rejectionNotes)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      {selectedDevelopmentProgramsDecision == null ? (
        <Well className="text-center">
          {intl.formatMessage(formMessages.decisionNullState)}
        </Well>
      ) : null}
    </div>
  );
};

export default DevelopmentProgramsSection;
