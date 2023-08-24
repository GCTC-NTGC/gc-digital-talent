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

const TalentSourcingDecisionSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

  // hooks to watch, needed for conditional rendering
  const [
    selectedContractingRationalePrimary,
    selectedContractingRationalesSecondary,
  ] = watch(["contractingRationalePrimary", "contractingRationalesSecondary"]);
  const isContractingRationalePrimaryOther =
    selectedContractingRationalePrimary === ContractingRationale.Other;
  const isContractingRationalePrimaryShortageOfTalent =
    selectedContractingRationalePrimary ===
    ContractingRationale.ShortageOfTalent;
  const doesContractingRationalesSecondaryIncludeOther =
    Array.isArray(selectedContractingRationalesSecondary) &&
    selectedContractingRationalesSecondary.includes(ContractingRationale.Other);

  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false });
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
  }, [
    resetField,
    isContractingRationalePrimaryOther,
    doesContractingRationalesSecondaryIncludeOther,
    isContractingRationalePrimaryShortageOfTalent,
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
        data-h2-gap="base(x.5)"
      >
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Select the primary rationale",
            id: "dwFVEN",
            description:
              "Label for _primary contracting rationale_ fieldset in the _digital services contracting questionnaire_",
          })}
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
            label={intl.formatMessage({
              defaultMessage: "Other rationale",
              id: "N9dBBh",
              description:
                "Label for _an other contracting rationale_ field in the _digital services contracting questionnaire_",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        {isContractingRationalePrimaryShortageOfTalent ? (
          <RadioGroup
            legend={intl.formatMessage({
              defaultMessage:
                "OCIO has confirmed that there is no available pre-qualified talent in an OCIO-coordinated talent pool that could meet the need in the timeframe provided.",
              id: "0uahrx",
              description:
                "Label for _OCIO confirmed talent shortage_ field in the _digital services contracting questionnaire_",
            })}
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
        <Checklist
          legend={intl.formatMessage({
            defaultMessage: "Identify any secondary rationales",
            id: "ckDYuu",
            description:
              "Label for _secondary contracting rationales_ fieldset in the _digital services contracting questionnaire_",
          })}
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
            label={intl.formatMessage({
              defaultMessage: "Other rationale",
              id: "N9dBBh",
              description:
                "Label for _an other contracting rationale_ field in the _digital services contracting questionnaire_",
            })}
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
        data-h2-gap="base(x.5)"
      >
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Will there be an ongoing need for the knowledge or skill sets in the work unit for which the contractor is being engaged?",
            id: "R5eNu/",
            description:
              "Label for _ongoing need for knowledge_ fieldset in the _digital services contracting questionnaire_",
          })}
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
          legend={intl.formatMessage({
            defaultMessage:
              "Has knowledge transfer from the contractor to the government work unit been built into the contract?",
            id: "IjBtl5",
            description:
              "Label for _knowledge transfer in contract_ fieldset in the _digital services contracting questionnaire_",
          })}
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
          legend={intl.formatMessage({
            defaultMessage:
              "Will employees have access to training and development for the knowledge or skill sets required in the contract?",
            id: "dD3S0i",
            description:
              "Label for _employees have access to knowledge_ fieldset in the _digital services contracting questionnaire_",
          })}
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
          legend={intl.formatMessage({
            defaultMessage:
              "Has OCIO been engaged on connecting employees to training and development opportunities related to the requirements in this contract, if appropriate?",
            id: "KcvmuN",
            description:
              "Label for _OCIO engaged for training_ fieldset in the _digital services contracting questionnaire_",
          })}
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
