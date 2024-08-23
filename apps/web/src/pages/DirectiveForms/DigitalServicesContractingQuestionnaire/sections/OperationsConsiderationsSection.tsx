import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { Checklist, Input, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { OperationsConsideration, YesNo } from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  getOperationsConsideration,
  getYesNo,
  operationsConsiderationsSortOrder,
  yesNoSortOrder,
} from "../../localizedConstants";
import useLabels from "../useLabels";
import CompoundQuestion from "../../CompoundQuestion";

const OperationsConsiderationsSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const labels = useLabels();

  // hooks to watch, needed for conditional rendering
  const [
    selectedHasOperationsConsiderations,
    selectedOperationsConsiderations,
  ] = watch(["hasOperationsConsiderations", "operationsConsiderations"]) as [
    YesNo,
    OperationsConsideration,
  ];

  const hasOperationsConsiderationsIsYes =
    selectedHasOperationsConsiderations === YesNo.Yes;

  const doesOperationsConsiderationsIncludeOther =
    Array.isArray(selectedOperationsConsiderations) &&
    selectedOperationsConsiderations.includes(OperationsConsideration.Other);

  /**
   * Reset un-rendered fields
   */
  useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!hasOperationsConsiderationsIsYes) {
      resetDirtyField("operationsConsiderations");
      resetDirtyField("operationsConsiderationsOther");
    }
    if (!doesOperationsConsiderationsIncludeOther) {
      resetDirtyField("operationsConsiderationsOther");
    }
  }, [
    resetField,
    doesOperationsConsiderationsIncludeOther,
    hasOperationsConsiderationsIsYes,
  ]);

  return (
    <TableOfContents.Section id={PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS}>
      <Heading
        data-h2-margin="base(x3, 0, x1, 0)"
        level="h3"
        size="h4"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <CompoundQuestion
          introduction={
            <>
              <p
                data-h2-margin-bottom="base(x.5)"
                data-h2-font-weight="base(700)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Do any of the following factors have influence on the decision to contract?",
                  id: "Aw00Lh",
                  description:
                    "Context for _operations considerations_ section, paragraph 1, in the _digital services contracting questionnaire_",
                })}
              </p>
              <ul>
                <li>
                  {intl.formatMessage(
                    getOperationsConsideration(
                      OperationsConsideration.FinanceVehicleNotUsable,
                    ),
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    getOperationsConsideration(
                      OperationsConsideration.FundingSecuredCostRecoveryBasis,
                    ),
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    getOperationsConsideration(
                      OperationsConsideration.UnableCreateNewIndeterminate,
                    ),
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    getOperationsConsideration(
                      OperationsConsideration.UnableCreateNewTerm,
                    ),
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    getOperationsConsideration(
                      OperationsConsideration.UnableCreateClassificationRestriction,
                    ),
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    getOperationsConsideration(
                      OperationsConsideration.StaffingFreeze,
                    ),
                  )}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "Other operations considerations not listed",
                    id: "e3BCAd",
                    description: "Other operations consideration",
                  })}
                </li>
              </ul>
            </>
          }
          inputElement={
            <RadioGroup
              legend={labels.hasOperationsConsiderations}
              id="hasOperationsConsiderations"
              name="hasOperationsConsiderations"
              idPrefix="hasOperationsConsiderations"
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
          }
        />
        {hasOperationsConsiderationsIsYes ? (
          <>
            <CompoundQuestion
              title={intl.formatMessage({
                defaultMessage: "Influencing factors",
                id: "TySSof",
                description:
                  "Title for _influencing factors_ section, in the _digital services contracting questionnaire_",
              })}
              introduction={intl.formatMessage({
                defaultMessage:
                  "This data is aggregated and used for identification of trends across departments. It is not used for analysis of any individual contracting decision.",
                id: "7KEfBI",
                description:
                  "Introduction for _influencing factors_ section, in the _digital services contracting questionnaire_",
              })}
              inputElement={
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
                />
              }
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
          </>
        ) : null}
      </div>
    </TableOfContents.Section>
  );
};

export default OperationsConsiderationsSection;
