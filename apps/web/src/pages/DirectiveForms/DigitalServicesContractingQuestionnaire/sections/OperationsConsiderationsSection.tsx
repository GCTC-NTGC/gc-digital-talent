import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { OperationsConsideration } from "@gc-digital-talent/graphql";
import { Checklist, Input } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  getOperationsConsideration,
  operationsConsiderationsSortOrder,
} from "../../localizedConstants";

const OperationsConsiderationsSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

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
      <Checklist
        idPrefix="operationsConsiderations"
        id="operationsConsiderations"
        name="operationsConsiderations"
        legend={intl.formatMessage({
          defaultMessage: "Influencing factors",
          id: "1J3/aR",
          description:
            "Label for _influencing factors_ fieldset in the _digital services contracting questionnaire_",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={enumToOptions(
          OperationsConsideration,
          operationsConsiderationsSortOrder,
        ).map((option) => {
          return {
            value: option.value as string,
            label: intl.formatMessage(getOperationsConsideration(option.value)),
          };
        })}
      />
      {doesOperationsConsiderationsIncludeOther ? (
        <Input
          id="operationsConsiderationsOther"
          name="operationsConsiderationsOther"
          type="text"
          label={intl.formatMessage(formMessages.specifyOther)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
    </TableOfContents.Section>
  );
};

export default OperationsConsiderationsSection;
