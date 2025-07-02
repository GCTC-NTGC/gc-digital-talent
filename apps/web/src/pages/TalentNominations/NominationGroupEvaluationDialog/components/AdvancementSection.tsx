import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

import { Checkbox, RadioGroup, RichTextInput } from "@gc-digital-talent/forms";
import { Heading, Well } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationGroupDecision,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import { formMessages } from "../messages";
import { FormValues } from "../form";

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
      }
    }
  `,
);

interface AdvancementSectionProps {
  talentNominationGroupQuery: FragmentType<
    typeof NominationGroupEvaluationDialogAdvancement_Fragment
  >;
}

const AdvancementSection = ({
  talentNominationGroupQuery,
}: AdvancementSectionProps) => {
  const intl = useIntl();

  const { watch, resetField } = useFormContext<FormValues>();
  const [selectedAdvancementDecision] = watch(["advancementDecision"]);

  useEffect(() => {
    const resetDirtyField = (
      name: keyof FormValues,
      defaultValue: null | string | boolean,
    ) => {
      resetField(name, { keepDirty: false, defaultValue });
    };

    if (
      selectedAdvancementDecision !== TalentNominationGroupDecision.Approved
    ) {
      resetDirtyField("advancementReferenceConfirmed", null);
      resetDirtyField("advancementApprovedNotes", null);
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
        <Well className="text-center">
          {intl.formatMessage(formMessages.decisionNullState)}
        </Well>
      ) : null}
    </div>
  );
};

export default AdvancementSection;
