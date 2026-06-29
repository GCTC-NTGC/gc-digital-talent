import { useIntl } from "react-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "urql";
import { useEffect } from "react";

import {
  Checkbox,
  Input,
  localizedEnumToOptions,
  Select,
} from "@gc-digital-talent/forms";
import { errorMessages, uiMessages } from "@gc-digital-talent/i18n";
import type { SupervisoryFieldOptionsQuery } from "@gc-digital-talent/graphql";
import { CSuiteRoleTitle, graphql } from "@gc-digital-talent/graphql";
import { Loading } from "@gc-digital-talent/ui";

import type {
  SubExperienceFormProps,
  WorkFormValues,
} from "~/types/experience";

const SupervisoryFieldOptions_Query = graphql(/* GraphQL */ `
  query SupervisoryFieldOptions {
    cSuiteRoleTitles: localizedEnumStrings(enumName: "cSuiteRoleTitle") {
      value
      label {
        localized
      }
    }
  }
`);

const SupervisoryFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<SupervisoryFieldOptionsQuery>({
    query: SupervisoryFieldOptions_Query,
  });
  const { resetField } = useFormContext<WorkFormValues>();

  const watchSupervisoryPosition = useWatch<WorkFormValues>({
    name: "supervisoryPosition",
  });
  const watchSupervisedEmployees = useWatch<WorkFormValues>({
    name: "supervisedEmployees",
  });
  const watchBudgetManagement = useWatch<WorkFormValues>({
    name: "budgetManagement",
  });
  const watchSeniorManagementStatus = useWatch<WorkFormValues>({
    name: "seniorManagementStatus",
  });
  const watchCSuiteRoleTitle = useWatch<WorkFormValues>({
    name: "cSuiteRoleTitle",
  });

  /**
   * Reset supervisory fields
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof WorkFormValues) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // reset all supervisory fields
    if (!watchSupervisoryPosition) {
      resetDirtyField("supervisedEmployees");
      resetDirtyField("supervisedEmployeesNumber");
      resetDirtyField("budgetManagement");
      resetDirtyField("annualBudgetAllocation");
      resetDirtyField("seniorManagementStatus");
      resetDirtyField("cSuiteRoleTitle");
      resetDirtyField("otherCSuiteRoleTitle");
    }

    // reset supervised supervisory fields
    if (!watchSupervisedEmployees) {
      resetDirtyField("supervisedEmployeesNumber");
    }

    // reset budget supervisory fields
    if (!watchBudgetManagement) {
      resetDirtyField("annualBudgetAllocation");
    }

    // reset senior management supervisory fields
    if (!watchSeniorManagementStatus) {
      resetDirtyField("cSuiteRoleTitle");
      resetDirtyField("otherCSuiteRoleTitle");
    }

    // reset senior management supervisory other fields
    if (watchCSuiteRoleTitle !== CSuiteRoleTitle.Other) {
      resetDirtyField("otherCSuiteRoleTitle");
    }
  }, [
    resetField,
    watchSupervisoryPosition,
    watchSupervisedEmployees,
    watchBudgetManagement,
    watchSeniorManagementStatus,
    watchCSuiteRoleTitle,
  ]);

  return (
    <>
      {fetching ? (
        <Loading inline />
      ) : (
        <>
          <Checkbox
            boundingBox
            boundingBoxLabel={labels.supervisoryPosition}
            id="supervisoryPosition"
            name="supervisoryPosition"
            label={intl.formatMessage({
              defaultMessage:
                "This role was a management or supervisory position.",
              id: "N/1OYS",
              description: "Label displayed for supervisory position",
            })}
          />
          {watchSupervisoryPosition && (
            <>
              <Checkbox
                boundingBox
                boundingBoxLabel={labels.supervisedEmployees}
                id="supervisedEmployees"
                name="supervisedEmployees"
                label={intl.formatMessage({
                  defaultMessage: "I supervised employees in this role.",
                  id: "6RGluQ",
                  description: "Label displayed for supervised employees",
                })}
              />
              {watchSupervisedEmployees && (
                <Input
                  id="supervisedEmployeesNumber"
                  name="supervisedEmployeesNumber"
                  label={labels.supervisedEmployeesNumber}
                  type="number"
                  min="1"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: 1,
                      message: intl.formatMessage(errorMessages.mustBeGreater, {
                        value: 1,
                      }),
                    },
                  }}
                />
              )}
              <Checkbox
                boundingBox
                boundingBoxLabel={labels.budgetManagement}
                id="budgetManagement"
                name="budgetManagement"
                label={intl.formatMessage({
                  defaultMessage:
                    "This role required that I managed a dedicated budget or had delegated signing authority for a budget.",
                  id: "144l3L",
                  description: "Label displayed for budget management",
                })}
              />
              {watchBudgetManagement && (
                <Input
                  id="annualBudgetAllocation"
                  name="annualBudgetAllocation"
                  label={labels.annualBudgetAllocation}
                  type="number"
                  min="1"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: 1,
                      message: intl.formatMessage(errorMessages.mustBeGreater, {
                        value: 1,
                      }),
                    },
                  }}
                />
              )}
              <Checkbox
                boundingBox
                boundingBoxLabel={labels.seniorManagementStatus}
                id="seniorManagementStatus"
                name="seniorManagementStatus"
                label={intl.formatMessage({
                  defaultMessage:
                    "This was a chief or deputy chief (C-suite) role.",
                  id: "ZOKEiB",
                  description: "Label displayed for senior management",
                })}
              />
              {watchSeniorManagementStatus && (
                <Select
                  id="cSuiteRoleTitle"
                  name="cSuiteRoleTitle"
                  label={labels.cSuiteRoleTitle}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={localizedEnumToOptions(data?.cSuiteRoleTitles, intl)}
                  doNotSort
                />
              )}
              {watchCSuiteRoleTitle === CSuiteRoleTitle.Other && (
                <Input
                  id="otherCSuiteRoleTitle"
                  name="otherCSuiteRoleTitle"
                  label={labels.otherCSuiteRoleTitle}
                  type="text"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default SupervisoryFields;
