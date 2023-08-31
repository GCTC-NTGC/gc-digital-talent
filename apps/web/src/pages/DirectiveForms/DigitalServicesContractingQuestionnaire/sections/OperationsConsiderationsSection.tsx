import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { OperationsConsideration } from "@gc-digital-talent/graphql";
import { Checklist, Input } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  getOperationsConsideration,
  operationsConsiderationsSortOrder,
} from "../../localizedConstants";
import getLabels from "../labels";

const OperationsConsiderationsSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const labels = getLabels(intl);

  // hooks to watch, needed for conditional rendering
  const [selectedOperationsConsiderations] = watch([
    "operationsConsiderations",
  ]);

  const doesOperationsConsiderationsIncludeOther =
    Array.isArray(selectedOperationsConsiderations) &&
    selectedOperationsConsiderations.includes(OperationsConsideration.Other);

  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!doesOperationsConsiderationsIncludeOther) {
      resetDirtyField("operationsConsiderationsOther");
    }
  }, [resetField, doesOperationsConsiderationsIncludeOther]);

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
      >
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This data is aggregated and used for identification of trends across departments. It is not used for analysis of any individual contracting decision.",
            id: "fEYR33",
            description:
              "Context for _operations considerations_ section in the _digital services contracting questionnaire_",
          })}
        </p>
        <Checklist
          idPrefix="operationsConsiderations"
          id="operationsConsiderations"
          name="operationsConsiderations"
          legend={labels.operationsConsiderations}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            OperationsConsideration,
            operationsConsiderationsSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(
                getOperationsConsideration(option.value),
              ),
            };
          })}
          context={intl.formatMessage({
            defaultMessage:
              "If any of the following factors have influenced the decision to contract, select all that apply.",
            id: "fug6/h",
            description:
              "Context for _influencing factors_ fieldset in the _digital services contracting questionnaire_",
          })}
        />
        {doesOperationsConsiderationsIncludeOther ? (
          <Input
            id="operationsConsiderationsOther"
            name="operationsConsiderationsOther"
            type="text"
            label={labels.operationsConsiderationsOther}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
      </div>
    </TableOfContents.Section>
  );
};

export default OperationsConsiderationsSection;
