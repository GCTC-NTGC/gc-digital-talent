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
  GovContractorType,
  GovFieldOptionsQuery,
  GovPositionType,
  graphql,
  WorkExperienceGovEmployeeType,
} from "@gc-digital-talent/graphql";
import { Loading } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

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
    govEmploymentTypes: localizedEnumStrings(
      enumName: "WorkExperienceGovEmployeeType"
    ) {
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

  // If the government employee type is "Term",
  // then remove the "Substantive" option from the govPositionTypes
  const allPositionTypes = localizedEnumToOptions(data?.govPositionTypes, intl);
  const conditionalPositionTypes =
    watchGovEmploymentType === WorkExperienceGovEmployeeType.Term
      ? allPositionTypes.filter(
          (positionType) =>
            positionType.value !== String(GovPositionType.Substantive),
        )
      : allPositionTypes;

  const departmentOptions = unpackMaybes(data?.departments)
    .filter(notEmpty)
    .map(({ id, name }) => ({
      value: id,
      label: getLocalizedName(name, intl),
    }));

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
        label: iterator.level.toString(),
      };
    });

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
    watchGovEmploymentType === WorkExperienceGovEmployeeType.Indeterminate;
  const indeterminateActing =
    isIndeterminate && watchGovPositionType === GovPositionType.Acting;
  const indeterminateAssignment =
    isIndeterminate && watchGovPositionType === GovPositionType.Assignment;
  const indeterminateSecondment =
    isIndeterminate && watchGovPositionType === GovPositionType.Secondment;

  const expectedEndDate =
    watchCurrentRole &&
    (watchGovEmploymentType === WorkExperienceGovEmployeeType.Student ||
      watchGovEmploymentType === WorkExperienceGovEmployeeType.Casual ||
      watchGovEmploymentType === WorkExperienceGovEmployeeType.Term ||
      indeterminateActing ||
      indeterminateAssignment ||
      indeterminateSecondment);

  /**
   * Reset classification group and level
   * when the employment type changes to casual or contract
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof WorkFormValues) => {
      resetField(name, {
        keepDirty: false,
      });
    };

    if (
      watchGovEmploymentType === WorkExperienceGovEmployeeType.Student ||
      watchGovEmploymentType === WorkExperienceGovEmployeeType.Contractor
    ) {
      resetDirtyField("classificationGroup");
      resetDirtyField("classificationLevel");
    }

    if (watchGovEmploymentType) {
      resetDirtyField("govPositionType");
    }

    if (watchGovEmploymentType !== WorkExperienceGovEmployeeType.Contractor) {
      resetDirtyField("govContractorRoleSeniority");
      resetDirtyField("govContractorType");
    }

    if (
      watchGovContractorType === GovContractorType.SelfEmployed ||
      watchGovEmploymentType !== WorkExperienceGovEmployeeType.Contractor
    ) {
      resetField("contractorFirmAgencyName", {
        keepDirty: false,
        defaultValue: undefined,
      });
    }
  }, [resetField, watchGovEmploymentType, watchGovContractorType]);

  return (
    <>
      {fetching ? (
        <div data-h2-flex-item="base(1of1)">
          <Loading inline />
        </div>
      ) : (
        <>
          <div data-h2-flex-item="base(1of1)">
            <Select
              id="department"
              label={intl.formatMessage(commonMessages.department)}
              name="department"
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              options={departmentOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1)">
            <Input
              id="team"
              label={labels.team}
              name="team"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1)">
            <RadioGroup
              idPrefix="govEmploymentType"
              name="govEmploymentType"
              legend={labels.govEmploymentType}
              items={localizedEnumToOptions(data?.govEmploymentTypes, intl)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          {(watchGovEmploymentType ===
            WorkExperienceGovEmployeeType.Indeterminate ||
            watchGovEmploymentType === WorkExperienceGovEmployeeType.Term) && (
            <div data-h2-flex-item="base(1of1)">
              <RadioGroup
                idPrefix="govPositionType"
                name="govPositionType"
                legend={labels.positionType}
                items={conditionalPositionTypes}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
          )}
          {watchGovEmploymentType ===
            WorkExperienceGovEmployeeType.Contractor && (
            <>
              <div data-h2-flex-item="base(1of1)">
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
              <div data-h2-flex-item="base(1of1)">
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
            <div data-h2-flex-item="base(1of1)">
              <Input
                id="contractorFirmAgencyName"
                name="contractorFirmAgencyName"
                type="text"
                label={labels.contractorFirmAgencyName}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
          )}
          {(watchGovEmploymentType === WorkExperienceGovEmployeeType.Casual ||
            watchGovEmploymentType ===
              WorkExperienceGovEmployeeType.Indeterminate ||
            watchGovEmploymentType === WorkExperienceGovEmployeeType.Term) && (
            <>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Select
                  id="classificationGroup"
                  label={labels.classificationGroup}
                  name="classificationGroup"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOptionLevel,
                  )}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={groupOptions}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
                />
              </div>
            </>
          )}
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <DateInput
              id="startDate"
              legend={labels.startDate}
              name="startDate"
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
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-margin-top="p-tablet(x1)">
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
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            {expectedEndDate ? (
              <DateInput
                id="endDate"
                legend={labels.expectedEndDate}
                name="endDate"
                show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: watchStartDate ? String(watchStartDate) : "",
                    message: intl.formatMessage(errorMessages.futureDate),
                  },
                }}
              />
            ) : (
              <>
                {!watchCurrentRole && (
                  <DateInput
                    id="endDate"
                    legend={labels.endDate}
                    name="endDate"
                    show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
                    rules={
                      watchCurrentRole
                        ? {}
                        : {
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
                            min: {
                              value: watchStartDate
                                ? String(watchStartDate)
                                : "",
                              message: intl.formatMessage(
                                errorMessages.futureDate,
                              ),
                            },
                          }
                    }
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default GovFields;
