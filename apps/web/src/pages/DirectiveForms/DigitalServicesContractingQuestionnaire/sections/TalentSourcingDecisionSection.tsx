import React, { useId } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import {
  Checklist,
  Input,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { ContractingRationale, YesNo } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { buildExternalLink, enumToOptions } from "../../util";
import {
  contractingRationaleSortOrder,
  getContractingRationale,
  getYesNo,
  yesNoSortOrder,
} from "../../localizedConstants";
import useLabels from "../useLabels";

const TalentSourcingDecisionSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const paths = useRoutes();
  const labels = useLabels();
  const ocioConfirmedDescriptionId = useId();
  const trackingNumberConfirmedDescriptionId = useId();

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
          <>
            <p id={ocioConfirmedDescriptionId}>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "If “{choice}” is selected as the primary rationale, you are required to verify that no talent is available through a <link>GC Digital Talent search</link>.",
                  id: "eADpIl",
                  description:
                    "introduction to needing more information about the talent search",
                },
                {
                  choice: intl.formatMessage(
                    getContractingRationale(
                      ContractingRationale.ShortageOfTalent,
                    ),
                  ),
                  link: (chunks: React.ReactNode) =>
                    buildExternalLink(paths.search(), chunks),
                },
              )}
            </p>
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
              aria-describedby={ocioConfirmedDescriptionId}
            />
          </>
        ) : null}
        {isOcioConfirmedTalentShortageYes ? (
          <>
            <p id={trackingNumberConfirmedDescriptionId}>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "If multiple types of resources have been identified under {sectionName}, please include one tracking number for each resource that fall under distinct IT workstreams and/or levels. Separate each tracking number with a comma.",
                  id: "ozKHDz",
                  description: "introduction to needing tracking IDs",
                },
                {
                  sectionName: intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.PERSONNEL_REQUIREMENTS),
                  ),
                  link: (chunks: React.ReactNode) =>
                    buildExternalLink(paths.search(), chunks),
                },
              )}
            </p>
            <TextArea
              id="talentSearchTrackingNumber"
              name="talentSearchTrackingNumber"
              label={labels.talentSearchTrackingNumber}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              aria-describedby={trackingNumberConfirmedDescriptionId}
            />
          </>
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
