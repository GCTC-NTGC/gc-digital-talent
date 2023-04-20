import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { ExternalLink, Well } from "@gc-digital-talent/ui";
import {
  FieldLabels,
  Input,
  RadioGroup,
  Select,
  enumToOptions,
  objectsToSortedOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  getGovEmployeeType,
  useLocale,
} from "@gc-digital-talent/i18n";

import { Classification, Department, GovEmployeeType } from "~/api/generated";

import { getGroupOptions, getLevelOptions } from "./utils";
import useDirtyFields from "../../hooks/useDirtyFields";

const priorityEntitlementLink = (locale: string, chunks: React.ReactNode) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/public-service-commission/services/information-priority-administration.html"
      : "https://www.canada.ca/fr/commission-fonction-publique/services/administration-priorites.html";
  return (
    <ExternalLink href={href} newTab>
      {chunks}
    </ExternalLink>
  );
};

export interface FormFieldsProps {
  departments: Department[];
  classifications: Classification[];
  labels: FieldLabels;
}

const FormFields = ({
  departments,
  classifications,
  labels,
}: FormFieldsProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  useDirtyFields("government");
  const { watch, resetField } = useFormContext();
  // hooks to watch, needed for conditional rendering
  const [govEmployee, govEmployeeStatus, groupSelection, priorityEntitlement] =
    watch([
      "govEmployeeYesNo",
      "govEmployeeType",
      "currentClassificationGroup",
      "priorityEntitlementYesNo",
    ]);

  const groupOptions = getGroupOptions(classifications, intl);
  const levelOptions = getLevelOptions(classifications, groupSelection);
  const hasPriorityEntitlement = priorityEntitlement === "yes";
  const isGovEmployee = govEmployee === "yes";
  const isPlaced =
    isGovEmployee &&
    (govEmployeeStatus === GovEmployeeType.Term ||
      govEmployeeStatus === GovEmployeeType.Indeterminate ||
      govEmployeeStatus === GovEmployeeType.Casual);

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, {
        keepDirty: false,
      });
    };

    if (!isGovEmployee) {
      resetDirtyField("department");
      resetDirtyField("govEmployeeType");
      if (!isPlaced) {
        resetDirtyField("currentClassificationGroup");
        if (groupSelection === "Choose Department") {
          resetDirtyField("currentClassificationLevel");
        }
      }
    }

    if (!hasPriorityEntitlement) {
      resetDirtyField("priorityEntitlementNumber");
    }
  }, [
    isGovEmployee,
    resetField,
    isPlaced,
    groupSelection,
    hasPriorityEntitlement,
  ]);

  return (
    <>
      <RadioGroup
        idPrefix="govEmployeeYesNo"
        legend={labels.govEmployeeYesNo}
        id="govEmployeeYesNo"
        name="govEmployeeYesNo"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "no",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>No</strong>, I am not a Government of Canada employee",
              id: "rJMWiV",
              description:
                "Label displayed for is not a government employee option",
            }),
          },
          {
            value: "yes",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>Yes</strong>, I am a Government of Canada employee",
              id: "jbftvG",
              description:
                "Label displayed for is a government employee option",
            }),
          },
        ]}
      />
      {isGovEmployee && (
        <>
          <Select
            id="department"
            name="department"
            label={labels.department}
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a department...",
              id: "WE/Nu+",
              description:
                "Null selection for department select input in the request form.",
            })}
            options={objectsToSortedOptions(departments, intl)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <RadioGroup
            idPrefix="govEmployeeType"
            legend={labels.govEmployeeType}
            name="govEmployeeType"
            id="govEmployeeType"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={enumToOptions(GovEmployeeType).map(({ value }) => ({
              value,
              label: intl.formatMessage(getGovEmployeeType(value)),
            }))}
          />
        </>
      )}
      {isPlaced && (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please indicate your current substantive group classification and level.",
              id: "TS63OC",
              description:
                "Text blurb, asking about classification and level in the government info form",
            })}
          </p>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
          >
            <div
              data-h2-padding="p-tablet(0, x2, 0, 0)"
              data-h2-width="base(100%)"
            >
              <Select
                id="currentClassificationGroup"
                label={labels.currentClassificationGroup}
                name="currentClassificationGroup"
                nullSelection={intl.formatMessage({
                  defaultMessage: "Choose Group",
                  id: "u4v1RB",
                  description: "Null selection for form.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={groupOptions}
              />
            </div>
            {groupSelection !== "Choose Department" && (
              <div style={{ width: "100%" }}>
                <Select
                  id="currentClassificationLevel"
                  label={labels.currentClassificationLevel}
                  name="currentClassificationLevel"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Choose Level",
                    id: "e/ez/m",
                    description: "Null selection for form.",
                  })}
                  options={levelOptions}
                />
              </div>
            )}
          </div>
        </>
      )}
      <RadioGroup
        idPrefix="priorityEntitlementYesNo"
        legend={labels.priorityEntitlementYesNo}
        name="priorityEntitlementYesNo"
        id="priorityEntitlementYesNo"
        describedBy="priority-description"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "no",
            label: intl.formatMessage({
              defaultMessage: "I do not have a priority entitlement",
              id: "brQu7D",
              description:
                "Label displayed for does not have priority entitlement option",
            }),
          },
          {
            value: "yes",
            label: intl.formatMessage({
              defaultMessage: "I have a priority entitlement",
              id: "uQ8Tss",
              description:
                "Label displayed does have priority entitlement option",
            }),
          },
        ]}
      />
      <Well
        id="priority-description"
        data-h2-padding="base(x.5)"
        data-h2-margin="base(x.25, 0, x1, 0)"
      >
        <p data-h2-font-size="base(caption)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Do you have a priority entitlement for Government of Canada job applications? This is a status provided by the Public Service Commission of Canada. To learn more, <priorityEntitlementLink>visit the information on priority entitlements site</priorityEntitlementLink>.",
              id: "25VYzu",
              description:
                "Sentence asking whether the user possesses priority entitlement",
            },
            {
              priorityEntitlementLink: (chunks: React.ReactNode) =>
                priorityEntitlementLink(locale, chunks),
            },
          )}
        </p>
      </Well>
      {hasPriorityEntitlement && (
        <Input
          id="priorityEntitlementNumber"
          type="text"
          label={labels.priorityEntitlementNumber}
          name="priorityEntitlementNumber"
        />
      )}
    </>
  );
};

export default FormFields;
