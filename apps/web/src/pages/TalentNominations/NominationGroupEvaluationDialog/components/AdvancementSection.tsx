import { useIntl } from "react-intl";

import { RadioGroup } from "@gc-digital-talent/forms";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import { formMessages } from "../messages";

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
        idPrefix="nominationForAdvancementDecision"
        name="nominationForAdvancementDecision"
        legend={intl.formatMessage(
          formMessages.advancementNominationDecisionLabel,
        )}
        items={[
          {
            value: "true",
            label: intl.formatMessage(
              formMessages.advancementNominationDecisionApproved,
            ),
          },
          {
            value: "false",
            label: intl.formatMessage(
              formMessages.advancementNominationDecisionNotApproved,
            ),
          },
        ]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
    </div>
  );
};

export default AdvancementSection;
