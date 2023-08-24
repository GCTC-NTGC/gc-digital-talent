import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { Checklist, Field, Input, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import { ContractingRationale } from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  contractingRationaleSortOrder,
  getContractingRationale,
} from "../../localizedConstants";

const TalentSourcingDecisionSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

  // hooks to watch, needed for conditional rendering
  const [selectedContractingRationalePrimary] = watch([
    "contractingRationalePrimary",
  ]);
  const isContractingRationalePrimaryOther =
    selectedContractingRationalePrimary === ContractingRationale.Other;

  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false });
    };

    // Reset all optional fields
    if (!isContractingRationalePrimaryOther) {
      resetDirtyField("contractingRationalePrimaryOther");
    }
  }, [resetField, isContractingRationalePrimaryOther]);

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
      <Field.Wrapper>
        <Field.Fieldset>
          <Field.Legend>
            {intl.formatMessage({
              defaultMessage: "Rationale for contracting",
              id: "dU6mlt",
              description:
                "Label for _rationale for contracting_ fieldset in the _digital services contracting questionnaire_",
            })}
          </Field.Legend>
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
                label: intl.formatMessage(
                  getContractingRationale(option.value),
                ),
              };
            })}
          />
          {isContractingRationalePrimaryOther ? (
            <Input
              id="contractingRationalePrimaryOther"
              name="contractingRationalePrimaryOther"
              type="text"
              label={intl.formatMessage(formMessages.specifyOther)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
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
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={enumToOptions(
              ContractingRationale,
              contractingRationaleSortOrder,
            ).map((option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(
                  getContractingRationale(option.value),
                ),
              };
            })}
          />
        </Field.Fieldset>
      </Field.Wrapper>
    </TableOfContents.Section>
  );
};

export default TalentSourcingDecisionSection;
