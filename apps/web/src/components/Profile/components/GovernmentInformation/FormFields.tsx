import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { ReactNode, useEffect } from "react";

import { Link, Well } from "@gc-digital-talent/ui";
import {
  FieldLabels,
  Input,
  RadioGroup,
  Select,
  localizedEnumToOptions,
  objectsToSortedOptions,
} from "@gc-digital-talent/forms";
import { errorMessages, uiMessages, getLocale } from "@gc-digital-talent/i18n";
import { notEmpty, workEmailDomainRegex } from "@gc-digital-talent/helpers";
import {
  FragmentType,
  GovEmployeeType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import useDirtyFields from "../../hooks/useDirtyFields";
import { getGroupOptions, getLevelOptions } from "./utils";
import { FormValues } from "./types";

const priorityEntitlementLink = (locale: string, chunks: ReactNode) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/public-service-commission/services/information-priority-administration.html"
      : "https://www.canada.ca/fr/commission-fonction-publique/services/administration-priorites.html";
  return (
    <Link href={href} newTab external>
      {chunks}
    </Link>
  );
};

const GovernmentInfoDepartment_Fragment = graphql(/* GraphQL */ `
  fragment GovernmentInfoDepartment on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);

export const GovernmentInfoClassification_Fragment = graphql(/* GraphQL */ `
  fragment GovernmentInfoClassification on Classification {
    id
    name {
      en
      fr
    }
    group
    level
  }
`);

const GovernmentInfoEmployeeTypes_Fragment = graphql(/* GraphQL */ `
  fragment GovernmentInfoEmployeeTypes on Query {
    employeeTypes: localizedEnumStrings(enumName: "GovEmployeeType") {
      value
      label {
        en
        fr
      }
    }
  }
`);

interface FormFieldsProps {
  departmentsQuery: FragmentType<typeof GovernmentInfoDepartment_Fragment>[];
  classificationsQuery: FragmentType<
    typeof GovernmentInfoClassification_Fragment
  >[];
  employeeTypesQuery?: FragmentType<
    typeof GovernmentInfoEmployeeTypes_Fragment
  >;
  labels: FieldLabels;
}

const FormFields = ({
  departmentsQuery,
  classificationsQuery,
  employeeTypesQuery,
  labels,
}: FormFieldsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const departments = getFragment(
    GovernmentInfoDepartment_Fragment,
    departmentsQuery,
  );
  const classifications = getFragment(
    GovernmentInfoClassification_Fragment,
    classificationsQuery,
  );
  const employeeTypesData = getFragment(
    GovernmentInfoEmployeeTypes_Fragment,
    employeeTypesQuery,
  );
  useDirtyFields("government");
  const { watch, resetField } = useFormContext<FormValues>();
  // hooks to watch, needed for conditional rendering
  const [govEmployee, govEmployeeStatus, groupSelection, priorityEntitlement] =
    watch([
      "govEmployeeYesNo",
      "govEmployeeType",
      "currentClassificationGroup",
      "priorityEntitlementYesNo",
    ]);

  const groupOptions = getGroupOptions([...classifications], intl);
  const levelOptions = getLevelOptions([...classifications], groupSelection);
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
  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
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
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1 0)"
    >
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
                "<strong>No</strong>, I am not a Government of Canada employee.",
              id: "PS/LFb",
              description:
                "Label displayed for is not a government employee option",
            }),
          },
          {
            value: "yes",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>Yes</strong>, I am a Government of Canada employee.",
              id: "gto/zD",
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
              defaultMessage: "Select a department",
              id: "y827h2",
              description:
                "Null selection for department select input in the request form.",
            })}
            options={objectsToSortedOptions([...departments], intl)}
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
            items={localizedEnumToOptions(
              employeeTypesData?.employeeTypes,
              intl,
            )}
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
                nullSelection={intl.formatMessage(
                  uiMessages.nullSelectionOptionGroup,
                )}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={groupOptions}
              />
            </div>
            {notEmpty(groupSelection) && (
              <div style={{ width: "100%" }}>
                <Select
                  id="currentClassificationLevel"
                  label={labels.currentClassificationLevel}
                  name="currentClassificationLevel"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOptionLevel,
                  )}
                  options={levelOptions}
                />
              </div>
            )}
          </div>
        </>
      )}
      {isGovEmployee && (
        <Input
          id="workEmail"
          name="workEmail"
          type="email"
          label={labels.workEmail}
          rules={{
            required: intl.formatMessage(errorMessages.required),
            pattern: {
              value: workEmailDomainRegex,
              message: intl.formatMessage({
                defaultMessage:
                  "This does not appear to be a Government of Canada email. If you are entering a Government of Canada email and still getting this error, please contact our support team.",
                id: "BLOt/e",
                description: "Description for rule pattern on work email field",
              }),
            },
          }}
        />
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
              defaultMessage:
                "<strong>No</strong>, I do not have a priority entitlement.",
              id: "09ijOa",
              description:
                "Label displayed for does not have priority entitlement option",
            }),
          },
          {
            value: "yes",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>Yes</strong>, I do have a priority entitlement.",
              id: "Xmtw0V",
              description:
                "Label displayed does have priority entitlement option",
            }),
          },
        ]}
      />
      <Well id="priority-description" data-h2-padding="base(x.5)">
        <p data-h2-font-size="base(caption)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Priority entitlement is a status provided by the Public Service Commission of Canada. To learn more, <priorityEntitlementLink>visit the Information on Priority Entitlement website</priorityEntitlementLink>.",
              id: "WpVd0l",
              description: "Sentence describing what priority entitlement is",
            },
            {
              priorityEntitlementLink: (chunks: ReactNode) =>
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
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
    </div>
  );
};

export default FormFields;
