import React, { useId } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { Checklist, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { TechnologicalChangeFactor, YesNo } from "@gc-digital-talent/graphql";

import { enumToOptions } from "../../util";
import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import {
  getTechnologicalChangeFactor,
  getYesNo,
  technologicalChangeFactorSortOrder,
  yesNoSortOrder,
} from "../../localizedConstants";
import useLabels from "../useLabels";

const TechnologicalChangeSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const labels = useLabels();
  const technologicalChangeDescriptionId = useId();

  // hooks to watch, needed for conditional rendering
  const [selectedHasTechnologicalChangeFactors] = watch([
    "hasTechnologicalChangeFactors",
  ]);

  const hasTechnologicalChangeFactorsIsYes =
    selectedHasTechnologicalChangeFactors === YesNo.Yes;

  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!hasTechnologicalChangeFactorsIsYes) {
      resetDirtyField("technologicalChangeFactors");
    }
  }, [resetField, hasTechnologicalChangeFactorsIsYes]);

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <div id={technologicalChangeDescriptionId}>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "Is the work being contracted out because it involves the introduction of:",
              id: "SycVSd",
              description:
                "Context for _technological change_ section, paragraph 1, in the _digital services contracting questionnaire_",
            })}
          </p>
          <ul>
            <li>
              {intl.formatMessage(
                getTechnologicalChangeFactor(
                  TechnologicalChangeFactor.DifferentNature,
                ),
              )}
            </li>
            <li>
              {intl.formatMessage(
                getTechnologicalChangeFactor(
                  TechnologicalChangeFactor.ChangeDepartmentOperation,
                ),
              )}
            </li>
            <li>
              {intl.formatMessage(
                getTechnologicalChangeFactor(
                  TechnologicalChangeFactor.NewTechnologicalSystem,
                ),
              )}
            </li>
            <li>
              {intl.formatMessage(
                getTechnologicalChangeFactor(
                  TechnologicalChangeFactor.ChangedTechnologicalSystem,
                ),
              )}
            </li>
          </ul>
        </div>
        <RadioGroup
          legend={labels.hasTechnologicalChangeFactors}
          id="hasTechnologicalChangeFactors"
          name="hasTechnologicalChangeFactors"
          idPrefix="hasTechnologicalChangeFactors"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
          aria-describedby={technologicalChangeDescriptionId}
        />
        {hasTechnologicalChangeFactorsIsYes ? (
          <Checklist
            idPrefix="technologicalChangeFactors"
            id="technologicalChangeFactors"
            name="technologicalChangeFactors"
            legend={labels.technologicalChangeFactors}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={enumToOptions(
              TechnologicalChangeFactor,
              technologicalChangeFactorSortOrder,
            ).map((option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(
                  getTechnologicalChangeFactor(option.value),
                ),
              };
            })}
            context={intl.formatMessage({
              defaultMessage: "Select all that apply.",
              id: "LIhpxW",
              description:
                "Context for _technological change factors_ fieldset in the _digital services contracting questionnaire_",
            })}
          />
        ) : null}
        <RadioGroup
          legend={labels.hasImpactOnYourDepartment}
          id="hasImpactOnYourDepartment"
          name="hasImpactOnYourDepartment"
          idPrefix="hasImpactOnYourDepartment"
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
          legend={labels.hasImmediateImpactOnOtherDepartments}
          id="hasImmediateImpactOnOtherDepartments"
          name="hasImmediateImpactOnOtherDepartments"
          idPrefix="hasImmediateImpactOnOtherDepartments"
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
          legend={labels.hasFutureImpactOnOtherDepartments}
          id="hasFutureImpactOnOtherDepartments"
          name="hasFutureImpactOnOtherDepartments"
          idPrefix="hasFutureImpactOnOtherDepartments"
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

export default TechnologicalChangeSection;
