import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { Checklist, Input, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { ContractingRationale, YesNo } from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  contractingRationaleSortOrder,
  getContractingRationale,
  getYesNo,
  yesNoSortOrder,
} from "../../localizedConstants";
import getLabels from "../labels";

const TalentSourcingDecisionSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const labels = getLabels(intl);

  // hooks to watch, needed for conditional rendering
  const [
    selectedContractingRationalePrimary,
    selectedContractingRationalesSecondary,
    selectedOcioConfirmedTalentShortage,
  ] = watch([
    "contractingRationalePrimary",
    "contractingRationalesSecondary",
    "ocioConfirmedTalentShortage",
  ]);
  const isContractingRationalePrimaryOther =
    selectedContractingRationalePrimary === ContractingRationale.Other;
  const isContractingRationalePrimaryShortageOfTalent =
    selectedContractingRationalePrimary ===
    ContractingRationale.ShortageOfTalent;
  const doesContractingRationalesSecondaryIncludeOther =
    Array.isArray(selectedContractingRationalesSecondary) &&
    selectedContractingRationalesSecondary.includes(ContractingRationale.Other);
  const isOcioConfirmedTalentShortageYes =
    selectedOcioConfirmedTalentShortage === YesNo.Yes;

  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!isContractingRationalePrimaryOther) {
      resetDirtyField("contractingRationalePrimaryOther");
    }
    if (!isContractingRationalePrimaryShortageOfTalent) {
      resetDirtyField("ocioConfirmedTalentShortage");
    }
    if (!doesContractingRationalesSecondaryIncludeOther) {
      resetDirtyField("contractingRationalesSecondaryOther");
    }
    if (!isOcioConfirmedTalentShortageYes) {
      resetDirtyField("talentSearchTrackingNumber");
    }
  }, [
    resetField,
    isContractingRationalePrimaryOther,
    doesContractingRationalesSecondaryIncludeOther,
    isContractingRationalePrimaryShortageOfTalent,
    isOcioConfirmedTalentShortageYes,
  ]);

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.TALENT_SOURCING_DECISION}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.TALENT_SOURCING_DECISION),
        )}
      </Heading>
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h4">
        {intl.formatMessage({
          defaultMessage: "Rationale for contracting",
          id: "TiutAx",
          description:
            "Label for _rationale for contracting_ section in the _digital services contracting questionnaire_",
        })}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <RadioGroup
          legend={labels.contractingRationalePrimary}
          id="contractingRationalePrimary"
          name="contractingRationalePrimary"
          idPrefix="contractingRationalePrimary"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            ContractingRationale,
            contractingRationaleSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getContractingRationale(option.value)),
            };
          })}
        />
        {isContractingRationalePrimaryOther ? (
          <Input
            id="contractingRationalePrimaryOther"
            name="contractingRationalePrimaryOther"
            type="text"
            label={labels.contractingRationalePrimaryOther}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        {isContractingRationalePrimaryShortageOfTalent ? (
          <RadioGroup
            legend={labels.ocioConfirmedTalentShortage}
            id="ocioConfirmedTalentShortage"
            name="ocioConfirmedTalentShortage"
            idPrefix="ocioConfirmedTalentShortage"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(getYesNo(option.value)),
              };
            })}
          />
        ) : null}
        {isOcioConfirmedTalentShortageYes ? (
          <Input
            id="talentSearchTrackingNumber"
            name="talentSearchTrackingNumber"
            type="text"
            label={labels.talentSearchTrackingNumber}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <Checklist
          legend={labels.contractingRationalesSecondary}
          id="contractingRationalesSecondary"
          name="contractingRationalesSecondary"
          idPrefix="contractingRationalesSecondary"
          items={enumToOptions(
            ContractingRationale,
            contractingRationaleSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getContractingRationale(option.value)),
            };
          })}
        />
        {doesContractingRationalesSecondaryIncludeOther ? (
          <Input
            id="contractingRationalesSecondaryOther"
            name="contractingRationalesSecondaryOther"
            type="text"
            label={labels.contractingRationalesSecondaryOther}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
      </div>
      <Heading data-h2-margin="base(x1, 0, x1, 0)" level="h4">
        {intl.formatMessage({
          defaultMessage: "Knowledge transfer",
          id: "OOHY6f",
          description:
            "Label for _knowledge transfer_ section in the _digital services contracting questionnaire_",
        })}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <RadioGroup
          legend={labels.ongoingNeedForKnowledge}
          id="ongoingNeedForKnowledge"
          name="ongoingNeedForKnowledge"
          idPrefix="ongoingNeedForKnowledge"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={labels.knowledgeTransferInContract}
          id="knowledgeTransferInContract"
          name="knowledgeTransferInContract"
          idPrefix="knowledgeTransferInContract"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={labels.employeesHaveAccessToKnowledge}
          id="employeesHaveAccessToKnowledge"
          name="employeesHaveAccessToKnowledge"
          idPrefix="employeesHaveAccessToKnowledge"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={labels.ocioEngagedForTraining}
          id="ocioEngagedForTraining"
          name="ocioEngagedForTraining"
          idPrefix="ocioEngagedForTraining"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
      </div>
    </TableOfContents.Section>
  );
};

export default TalentSourcingDecisionSection;
