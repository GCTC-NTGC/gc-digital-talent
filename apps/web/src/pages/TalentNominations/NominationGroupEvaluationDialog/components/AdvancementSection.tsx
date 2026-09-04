import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useEffect, useId } from "react";
import uniqBy from "lodash/uniqBy";

import {
  Checkbox,
  Combobox,
  DateInput,
  RadioGroup,
  RichTextInput,
} from "@gc-digital-talent/forms";
import { Heading, Notice, Ul } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  TalentNominationGroupDecision,
} from "@gc-digital-talent/graphql";
import {
  notEmpty,
  sortAlphaBy,
  unpackMaybes,
} from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import { formMessages } from "../messages";
import type { FormValues } from "../form";

const NominationGroupEvaluationDialogAdvancement_Fragment = graphql(
  /* GraphQL */ `
    fragment NominationGroupEvaluationDialogAdvancement on TalentNominationGroup {
      id
      nominations {
        nominateForAdvancement
        advancementReference {
          workEmail
        }
        advancementReferenceFallbackWorkEmail
        recommendedAdvancementClassifications: advancementClassifications {
          id
          groupAndLevel
        }
      }
      advancementClassifications {
        id
        groupAndLevel
      }
      advancementReferralExpiryDate
    }
  `,
);

const NominationGroupEvaluationDialogAdvancementOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment NominationGroupEvaluationDialogAdvancementOptions on Query {
      classifications {
        id
        groupAndLevel
      }
    }
  `,
);

interface AdvancementSectionProps {
  talentNominationGroupQuery: FragmentType<
    typeof NominationGroupEvaluationDialogAdvancement_Fragment
  >;
  talentNominationGroupOptionsQuery: FragmentType<
    typeof NominationGroupEvaluationDialogAdvancementOptions_Fragment
  >;
}

const AdvancementSection = ({
  talentNominationGroupQuery,
  talentNominationGroupOptionsQuery,
}: AdvancementSectionProps) => {
  const intl = useIntl();
  const advancementClassificationIntroductionId = useId();

  const { watch, resetField } = useFormContext<FormValues>();
  const [selectedAdvancementDecision] = watch(["advancementDecision"]);

  useEffect(() => {
    const resetDirtyField = (
      name: keyof FormValues,
      defaultValue: null | string | boolean | string[],
    ) => {
      resetField(name, { keepDirty: false, defaultValue });
    };

    if (
      selectedAdvancementDecision !== TalentNominationGroupDecision.Approved
    ) {
      resetDirtyField("advancementReferenceConfirmed", null);
      resetDirtyField("advancementApprovedNotes", null);
      resetDirtyField("advancementClassifications", []);
      resetDirtyField("advancementReferralExpiryDate", "");
    }

    if (
      selectedAdvancementDecision !== TalentNominationGroupDecision.Rejected
    ) {
      resetDirtyField("advancementRejectedNotes", null);
    }
  }, [resetField, selectedAdvancementDecision]);

  const talentNominationGroup = getFragment(
    NominationGroupEvaluationDialogAdvancement_Fragment,
    talentNominationGroupQuery,
  );
  const talentNominationGroupOptions = getFragment(
    NominationGroupEvaluationDialogAdvancementOptions_Fragment,
    talentNominationGroupOptionsQuery,
  );

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

  const allRecommendedAdvancementClassifications = uniqBy(
    unpackMaybes(
      nominations?.flatMap((n) => n.recommendedAdvancementClassifications),
    ),
    (classification) => classification.id,
  );
  allRecommendedAdvancementClassifications.sort(
    sortAlphaBy((c) => c.groupAndLevel),
  );

  return (
    <div className="flex flex-col gap-6">
      <Heading level="h3" size="h6" className="m-0 font-normal">
        {intl.formatMessage({
          defaultMessage: "Nomination for advancement",
          id: "5qopVO",
          description: "heading for advancement nomination section",
        })}
      </Heading>
      <FieldDisplay
        label={intl.formatMessage(formMessages.advancementReferenceWorkEmail)}
      >
        {advancementReferenceWorkEmails ||
          intl.formatMessage(commonMessages.notFound)}
      </FieldDisplay>
      <RadioGroup
        idPrefix="advancementDecision"
        name="advancementDecision"
        legend={intl.formatMessage(
          formMessages.advancementNominationDecisionLabel,
        )}
        items={[
          {
            value: TalentNominationGroupDecision.Approved,
            label: intl.formatMessage(
              formMessages.advancementNominationDecisionApproved,
            ),
          },
          {
            value: TalentNominationGroupDecision.Rejected,
            label: intl.formatMessage(
              formMessages.advancementNominationDecisionRejected,
            ),
          },
        ]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      {selectedAdvancementDecision == TalentNominationGroupDecision.Approved ? (
        <>
          <Checkbox
            id="advancementReferenceConfirmed"
            name="advancementReferenceConfirmed"
            label={intl.formatMessage(
              formMessages.referenceConfirmationStatement,
            )}
            boundingBox={true}
            boundingBoxLabel={intl.formatMessage(
              formMessages.referenceConfirmationLabel,
            )}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <p id={advancementClassificationIntroductionId}>
            {intl.formatMessage({
              defaultMessage:
                "Please indicate the classifications this nominee should be referred for. The recommended classifications supplied by the nominator have been provided as reference.",
              id: "A4+XAq",
              description: "introduction for advancement classifications",
            })}
          </p>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Proposed classifications for advancement",
              id: "FEjHL6",
              description: "A list of classifications for advancement",
            })}
          >
            {allRecommendedAdvancementClassifications.length ? (
              <Ul space="md">
                {allRecommendedAdvancementClassifications.map((c) => (
                  <li key={c.id}>{c.groupAndLevel}</li>
                ))}
              </Ul>
            ) : (
              intl.formatMessage(commonMessages.notProvided)
            )}
          </FieldDisplay>
          <Combobox
            id="advancementClassifications"
            name="advancementClassifications"
            isMulti
            label={intl.formatMessage({
              defaultMessage:
                "Classifications this nominee is eligible to advance to",
              id: "K5x0Ph",
              description:
                "Label for advancement eligible classifications field",
            })}
            options={unpackMaybes(
              talentNominationGroupOptions?.classifications,
            ).map(({ id, groupAndLevel }) => ({
              value: id,
              label:
                groupAndLevel ?? intl.formatMessage(commonMessages.notProvided),
            }))}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            aria-describedby={advancementClassificationIntroductionId}
          />
          <DateInput
            id="advancementReferralExpiryDate"
            name="advancementReferralExpiryDate"
            legend={intl.formatMessage({
              defaultMessage: "Referral expiry date",
              id: "VeYTqO",
              description: "Label for referral expiry date field",
            })}
            context={intl.formatMessage({
              defaultMessage:
                "The nominee will be referred for the classifications chosen above until this date (inclusive).",
              id: "rnFFzE",
              description: "Help text for referral expiry date field",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <RichTextInput
            id="advancementApprovedNotes"
            name="advancementApprovedNotes"
            label={intl.formatMessage(formMessages.approvalNotes)}
          />
        </>
      ) : null}
      {selectedAdvancementDecision == TalentNominationGroupDecision.Rejected ? (
        <RichTextInput
          id="advancementRejectedNotes"
          name="advancementRejectedNotes"
          label={intl.formatMessage(formMessages.rejectionNotes)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      {selectedAdvancementDecision == null ? (
        <Notice.Root className="text-center">
          <Notice.Content>
            {intl.formatMessage(formMessages.decisionNullState)}
          </Notice.Content>
        </Notice.Root>
      ) : null}
    </div>
  );
};

export default AdvancementSection;
