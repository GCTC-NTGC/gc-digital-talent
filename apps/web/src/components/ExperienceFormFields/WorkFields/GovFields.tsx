import { useIntl } from "react-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "urql";
import uniqBy from "lodash/uniqBy";
import { useEffect } from "react";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  localizedEnumToOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import {
  CSuiteRoleTitle,
  GovContractorType,
  GovEmployeeType,
  GovFieldOptionsQuery,
  GovPositionType,
  graphql,
} from "@gc-digital-talent/graphql";
import { Loading } from "@gc-digital-talent/ui";
import { nodeToString, unpackMaybes } from "@gc-digital-talent/helpers";

import { SubExperienceFormProps, WorkFormValues } from "~/types/experience";
import { splitAndJoin } from "~/utils/nameUtils";

const GovFieldOptions_Query = graphql(/* GraphQL */ `
  query GovFieldOptions {
    departments {
      id
      name {
        en
        fr
      }
    }
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
    }
    govEmploymentTypes: localizedEnumStrings(enumName: "GovEmployeeType") {
      value
      label {
        en
        fr
      }
    }
    govPositionTypes: localizedEnumStrings(enumName: "GovPositionType") {
      value
      label {
        en
        fr
      }
    }
    govContractorRoleSeniorities: localizedEnumStrings(
      enumName: "GovContractorRoleSeniority"
    ) {
      value
      label {
        en
        fr
      }
    }
    govContractorTypes: localizedEnumStrings(enumName: "GovContractorType") {
      value
      label {
        en
        fr
      }
    }
    cSuiteRoleTitles: localizedEnumStrings(enumName: "cSuiteRoleTitle") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const GovFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<GovFieldOptionsQuery>({
    query: GovFieldOptions_Query,
  });
  const { resetField } = useFormContext<WorkFormValues>();

  const todayDate = new Date();
  const watchStartDate = useWatch<WorkFormValues>({ name: "startDate" });
  const watchCurrentRole = useWatch<WorkFormValues>({
    name: "currentRole",
  });
  const watchGroupSelection = useWatch<WorkFormValues>({
    name: "classificationGroup",
  });
  const watchGovEmploymentType = useWatch<WorkFormValues>({
    name: "govEmploymentType",
  });
  const watchGovPositionType = useWatch<WorkFormValues>({
    name: "govPositionType",
  });
  const watchGovContractorType = useWatch<WorkFormValues>({
    name: "govContractorType",
  });
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

  const departmentOptions = unpackMaybes(data?.departments).map(
    ({ id, name }) => ({
      value: id,
      label: getLocalizedName(name, intl),
    }),
  );

  // Consolidate James's classification-> group and level form logic
  const classifications = unpackMaybes(data?.classifications);

  const classGroupsWithDupes: {
    label: string;
    ariaLabel: string;
  }[] = classifications.map((classification) => {
    return {
      label:
        classification.group ||
        intl.formatMessage({
          defaultMessage: "Error: classification group not found.",
          id: "YA/7nb",
          description: "Error message if classification group is not defined.",
        }),
      ariaLabel: `${getLocalizedName(classification.name, intl)} ${splitAndJoin(
        classification.group,
      )}`,
    };
  });
  const noDupes = uniqBy(classGroupsWithDupes, "label");
  const groupOptions = noDupes.map(({ label, ariaLabel }) => {
    return {
      value: label,
      label,
      ariaLabel,
    };
  });

  // generate classification levels from the selected group
  const levelOptions = classifications
    .filter((x) => x.group === watchGroupSelection)
    .map((iterator) => {
      return {
        value: iterator.id.toString(), // change the value to id for the query
        label: iterator.level,
      };
    })
    .sort((a, b) => a.label - b.label);

  /**
   * Reset classification level when group changes
   * because level options change
   */
  useEffect(() => {
    resetField("classificationLevel", {
      keepDirty: false,
    });
  }, [resetField, watchGroupSelection]);

  const isIndeterminate =
    watchGovEmploymentType === GovEmployeeType.Indeterminate;
  const indeterminateActing =
    isIndeterminate && watchGovPositionType === GovPositionType.Acting;
  const indeterminateAssignment =
    isIndeterminate && watchGovPositionType === GovPositionType.Assignment;
  const indeterminateSecondment =
    isIndeterminate && watchGovPositionType === GovPositionType.Secondment;

  const expectedEndDate =
    watchCurrentRole &&
    (watchGovEmploymentType === GovEmployeeType.Student ||
      watchGovEmploymentType === GovEmployeeType.Casual ||
      watchGovEmploymentType === GovEmployeeType.Term ||
      indeterminateActing ||
      indeterminateAssignment ||
      indeterminateSecondment);

  /**
   * Reset classification group and level
   * when the employment type changes to casual or contract
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof WorkFormValues) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    if (
      watchGovEmploymentType === GovEmployeeType.Student ||
      watchGovEmploymentType === GovEmployeeType.Contractor
    ) {
      resetDirtyField("classificationGroup");
      resetDirtyField("classificationLevel");
    }

    if (watchGovEmploymentType !== GovEmployeeType.Indeterminate) {
      resetDirtyField("govPositionType");
    }

    if (watchGovEmploymentType !== GovEmployeeType.Contractor) {
      resetDirtyField("govContractorRoleSeniority");
      resetDirtyField("govContractorType");
    }

    if (
      watchGovContractorType === GovContractorType.SelfEmployed ||
      watchGovEmploymentType !== GovEmployeeType.Contractor
    ) {
      resetDirtyField("contractorFirmAgencyName");
    }
  }, [resetField, watchGovEmploymentType, watchGovContractorType]);

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
        <div className="col-span-2">
          <Loading inline />
        </div>
      ) : (
        <>
          <div className="col-span-2">
            <Select
              id="department"
              label={intl.formatMessage(commonMessages.department)}
              name="department"
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              options={departmentOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div className="col-span-2">
            <Input
              id="team"
              label={labels.team}
              name="team"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div className="col-span-2">
            <RadioGroup
              idPrefix="govEmploymentType"
              name="govEmploymentType"
              legend={labels.govEmploymentType}
              items={localizedEnumToOptions(data?.govEmploymentTypes, intl)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          {watchGovEmploymentType === GovEmployeeType.Indeterminate && (
            <div className="col-span-2">
              <RadioGroup
                idPrefix="govPositionType"
                name="govPositionType"
                legend={labels.positionType}
                items={localizedEnumToOptions(data?.govPositionTypes, intl)}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
          )}
          {watchGovEmploymentType === GovEmployeeType.Contractor && (
            <>
              <div className="col-span-2">
                <RadioGroup
                  idPrefix="govContractorRoleSeniority"
                  name="govContractorRoleSeniority"
                  legend={labels.govContractorRoleSeniority}
                  items={localizedEnumToOptions(
                    data?.govContractorRoleSeniorities,
                    intl,
                  )}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div className="col-span-2">
                <RadioGroup
                  idPrefix="govContractorType"
                  name="govContractorType"
                  legend={labels.govContractorType}
                  items={localizedEnumToOptions(data?.govContractorTypes, intl)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </>
          )}
          {watchGovContractorType === GovContractorType.FirmOrAgency && (
            <div className="col-span-2">
              <Input
                id="contractorFirmAgencyName"
                name="contractorFirmAgencyName"
                type="text"
                label={labels.contractorFirmAgencyName}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
          )}
          {(watchGovEmploymentType === GovEmployeeType.Casual ||
            watchGovEmploymentType === GovEmployeeType.Indeterminate ||
            watchGovEmploymentType === GovEmployeeType.Term) && (
            <>
              <div>
                <Select
                  id="classificationGroup"
                  label={labels.classificationGroup}
                  name="classificationGroup"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOptionGroup,
                  )}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={groupOptions}
                />
              </div>
              <div>
                <Select
                  id="classificationLevel"
                  label={labels.classificationLevel}
                  name="classificationLevel"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOptionLevel,
                  )}
                  options={levelOptions}
                  doNotSort
                />
              </div>
            </>
          )}
          <div>
            <DateInput
              id="startDate"
              legend={labels.startDate}
              name="startDate"
              round="floor"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                max: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(errorMessages.mustNotBeFuture),
                },
              }}
            />
          </div>
          <div>
            <div className="mt-6">
              <Checkbox
                boundingBox
                boundingBoxLabel={labels.currentRole}
                id="currentRole"
                label={intl.formatMessage({
                  defaultMessage: "I am currently active in this role",
                  id: "mOx5K1",
                  description: "Label displayed for current role input",
                })}
                name="currentRole"
              />
            </div>
          </div>
          <div>
            {expectedEndDate ? (
              <DateInput
                id="endDate"
                legend={labels.expectedEndDate}
                name="endDate"
                show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
                round="ceil"
                rules={
                  watchCurrentRole
                    ? {
                        required: intl.formatMessage(errorMessages.required),
                        min: {
                          value: strToFormDate(todayDate.toISOString()),
                          message: intl.formatMessage(errorMessages.futureDate),
                        },
                      }
                    : {
                        required: intl.formatMessage(errorMessages.required),
                        min: {
                          value: watchStartDate ? String(watchStartDate) : "",
                          message: intl.formatMessage(
                            errorMessages.minDateLabel,
                            {
                              label: nodeToString(
                                labels.startDate,
                              ).toLowerCase(),
                            },
                          ),
                        },
                        max: {
                          value: strToFormDate(todayDate.toISOString()),
                          message: intl.formatMessage(
                            errorMessages.mustNotBeFuture,
                          ),
                        },
                      }
                }
              />
            ) : (
              <>
                {!watchCurrentRole && (
                  <DateInput
                    id="endDate"
                    legend={labels.endDate}
                    name="endDate"
                    round="ceil"
                    show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                      min: {
                        value: watchStartDate ? String(watchStartDate) : "",
                        message: intl.formatMessage(
                          errorMessages.minDateLabel,
                          {
                            label: nodeToString(labels.startDate).toLowerCase(),
                          },
                        ),
                      },
                      max: {
                        value: strToFormDate(todayDate.toISOString()),
                        message: intl.formatMessage(
                          errorMessages.mustNotBeFuture,
                        ),
                      },
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div className="col-span-2">
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
          </div>
          {watchSupervisoryPosition && (
            <>
              <div className="col-span-2">
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
              </div>
              {watchSupervisedEmployees && (
                <div className="col-span-2">
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
                        message: intl.formatMessage(
                          errorMessages.mustBeGreater,
                          {
                            value: 1,
                          },
                        ),
                      },
                    }}
                  />
                </div>
              )}
              <div className="col-span-2">
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
              </div>
              {watchBudgetManagement && (
                <div className="col-span-2">
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
                        message: intl.formatMessage(
                          errorMessages.mustBeGreater,
                          {
                            value: 1,
                          },
                        ),
                      },
                    }}
                  />
                </div>
              )}
              <div className="col-span-2">
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
              </div>
              {watchSeniorManagementStatus && (
                <div className="col-span-2">
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
                    options={localizedEnumToOptions(
                      data?.cSuiteRoleTitles,
                      intl,
                    )}
                    doNotSort
                  />
                </div>
              )}
              {watchCSuiteRoleTitle === CSuiteRoleTitle.Other && (
                <div className="col-span-2">
                  <Input
                    id="otherCSuiteRoleTitle"
                    name="otherCSuiteRoleTitle"
                    label={labels.otherCSuiteRoleTitle}
                    type="text"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default GovFields;
