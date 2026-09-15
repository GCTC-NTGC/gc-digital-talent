import type { MessageDescriptor } from "react-intl";
import { defineMessage, useIntl } from "react-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "urql";
import uniqBy from "lodash/uniqBy";
import { useEffect } from "react";

import type { Radio } from "@gc-digital-talent/forms";
import {
  Combobox,
  DATE_SEGMENT,
  DateInput,
  Input,
  localizedEnumToOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  uiMessages,
  narrowEnumType,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import type { GovFieldOptionsQuery } from "@gc-digital-talent/graphql";
import {
  GovContractorType,
  GovEmployeeType,
  GovPositionType,
  graphql,
} from "@gc-digital-talent/graphql";
import { Loading, Notice } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import type {
  SubExperienceFormProps,
  WorkFormValues,
} from "~/types/experience";
import { splitAndJoin } from "~/utils/nameUtils";

import SupervisoryFields from "./SupervisoryFields";

const GovFieldOptions_Query = graphql(/* GraphQL */ `
  query GovFieldOptions {
    me {
      workExperiences {
        endDate
        govPositionType {
          value
        }
      }
    }
    departments {
      id
      name {
        localized
      }
    }
    classifications {
      id
      name {
        localized
      }
      group
      level
    }
    govEmploymentTypes: localizedEnumOptions(enumName: "GovEmployeeType") {
      ... on LocalizedGovEmployeeType {
        value
        label {
          localized
        }
      }
    }
    govPositionTypes: localizedEnumOptions(enumName: "GovPositionType") {
      ... on LocalizedGovPositionType {
        value
        label {
          localized
        }
      }
    }
    govContractorRoleSeniorities: localizedEnumStrings(
      enumName: "GovContractorRoleSeniority"
    ) {
      value
      label {
        localized
      }
    }
    govContractorTypes: localizedEnumStrings(enumName: "GovContractorType") {
      value
      label {
        localized
      }
    }
  }
`);

const govPositionTypeDescriptions: Record<GovPositionType, MessageDescriptor> =
  {
    SUBSTANTIVE: defineMessage({
      defaultMessage:
        "The position (classification, level, role, and department) to which you were indeterminately hired.",
      id: "UpM9RV",
      description:
        "Description for the substantive government position option in work experience",
    }),
    ACTING: defineMessage({
      defaultMessage:
        "The temporary performance of responsibilities of a position that is at a higher level than your substantive position.",
      id: "xeHfvB",
      description:
        "Description for the acting government position option in work experience",
    }),
    SECONDMENT: defineMessage({
      defaultMessage:
        "A temporary move at-level to another department or agency for which Treasury Board is the employer.",
      id: "e8zukj",
      description:
        "Description for the secondment government position option in work experience",
    }),
    ASSIGNMENT: defineMessage({
      defaultMessage:
        "A temporary move to a vacant role at-level within your own department or agency.",
      id: "iAAqjA",
      description:
        "Description for the assignment government position option in work experience",
    }),
  };

const GovFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<GovFieldOptionsQuery>({
    query: GovFieldOptions_Query,
  });
  const { resetField } = useFormContext<WorkFormValues>();

  const todayDate = new Date();
  // to toggle whether expected End date is required, the state of the role status radio must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch<WorkFormValues>({ name: "roleStatus" }) !== "past";
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

  const govEmploymentTypeOrder: string[] = [
    GovEmployeeType.Indeterminate,
    GovEmployeeType.Term,
    GovEmployeeType.Casual,
    GovEmployeeType.Student,
    GovEmployeeType.Interchange,
    GovEmployeeType.Contractor,
  ];
  const govEmploymentTypeOptions: Radio[] = narrowEnumType(
    unpackMaybes(data?.govEmploymentTypes),
    "GovEmployeeType",
  )
    .sort((a, b) => {
      return (
        govEmploymentTypeOrder.indexOf(a.value) -
        govEmploymentTypeOrder.indexOf(b.value)
      );
    })
    .map(({ value, label }) => {
      const contentBelow =
        value == GovEmployeeType.Interchange
          ? intl.formatMessage({
              defaultMessage:
                "(Non-government employee in a Government of Canada role)",
              id: "dQUFph",
              description:
                "Description for the interchange employment type option in government work experience",
            })
          : null;
      return {
        value,
        label: label.localized,
        contentBelow,
      };
    });

  const govPositionTypeOptions: Radio[] = narrowEnumType(
    unpackMaybes(data?.govPositionTypes),
    "GovPositionType",
  ).map(({ value, label }) => {
    const contentBelow = govPositionTypeDescriptions[value];
    return {
      label: label.localized,
      value,
      contentBelow: intl.formatMessage(contentBelow),
    };
  });

  const hasCurrentSubstantiveExperience = data?.me?.workExperiences?.some(
    (experience) =>
      experience?.govPositionType?.value === GovPositionType.Substantive &&
      !experience.endDate,
  );

  const departmentOptions = unpackMaybes(data?.departments).map(
    ({ id, name }) => ({
      value: id,
      label: name?.localized ?? "",
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
      ariaLabel: `${classification.name?.localized} ${splitAndJoin(
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
    isCurrent &&
    (watchGovEmploymentType === GovEmployeeType.Student ||
      watchGovEmploymentType === GovEmployeeType.Casual ||
      watchGovEmploymentType === GovEmployeeType.Term ||
      watchGovEmploymentType === GovEmployeeType.Interchange ||
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

  return (
    <>
      {fetching ? (
        <Loading inline />
      ) : (
        <>
          <Combobox
            id="department"
            label={labels.organization}
            name="department"
            options={departmentOptions}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            trackUnsaved={false}
            context={intl.formatMessage({
              defaultMessage:
                "If the organization you work with is not listed, please select “External organization” as the “Employment category” for this experience.",
              id: "Ohmv/N",
              description:
                "Informational text for the government organization field of the work experience form.",
            })}
          />
          <Input
            id="team"
            label={labels.team}
            name="team"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <RadioGroup
            idPrefix="govEmploymentType"
            name="govEmploymentType"
            legend={labels.govEmploymentType}
            items={govEmploymentTypeOptions}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          {!watchGovEmploymentType && (
            <Notice.Root>
              <Notice.Content>
                <p className="text-center">
                  {intl.formatMessage({
                    defaultMessage:
                      "Please select an employment type to continue.",
                    id: "RYuIb2",
                    description:
                      "Text displayed on the work experience form when a user has not selected an employment type.",
                  })}
                </p>
              </Notice.Content>
            </Notice.Root>
          )}
          {watchGovEmploymentType === GovEmployeeType.Indeterminate && (
            <RadioGroup
              idPrefix="govPositionType"
              name="govPositionType"
              legend={labels.positionType}
              items={govPositionTypeOptions}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          )}
          {watchGovPositionType === GovPositionType.Acting &&
            !hasCurrentSubstantiveExperience && (
              <Notice.Root color="warning">
                <Notice.Content>
                  <p className="text-center">
                    {intl.formatMessage({
                      defaultMessage:
                        "You've indicated this role is an active acting role, however, you haven't added an active substantive role to your work experience. You'll be able to continue adding this experience, but we ask that you ensure that your substantive role is added as well.",
                      id: "IGgfuh",
                      description:
                        "Text displayed on the work experience form when a user has not selected an employment type.",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
            )}
          {watchGovEmploymentType === GovEmployeeType.Contractor && (
            <>
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
              <RadioGroup
                idPrefix="govContractorType"
                name="govContractorType"
                legend={labels.govContractorType}
                items={localizedEnumToOptions(data?.govContractorTypes, intl)}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </>
          )}
          {watchGovContractorType === GovContractorType.FirmOrAgency && (
            <Input
              id="contractorFirmAgencyName"
              name="contractorFirmAgencyName"
              type="text"
              label={labels.contractorFirmAgencyName}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          )}
          {(watchGovEmploymentType === GovEmployeeType.Casual ||
            watchGovEmploymentType === GovEmployeeType.Indeterminate ||
            watchGovEmploymentType === GovEmployeeType.Term ||
            watchGovEmploymentType === GovEmployeeType.Interchange) && (
            <div>
              <p className="mb-1.5 font-bold">{labels.classification}</p>
              <div className="grid gap-3 xs:grid-cols-4">
                <div className="xs:col-span-3">
                  <Combobox
                    id="classificationGroup"
                    label={labels.classificationGroup}
                    name="classificationGroup"
                    placeholder={intl.formatMessage(
                      uiMessages.nullSelectionOptionGroup,
                    )}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    options={groupOptions}
                    trackUnsaved={false}
                  />
                </div>
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
            </div>
          )}
          {expectedEndDate && (
            <DateInput
              id="endDate"
              legend={labels.expectedEndDate}
              name="endDate"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              round="ceil"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(errorMessages.futureDate),
                },
              }}
            />
          )}
          <SupervisoryFields labels={labels} />
        </>
      )}
    </>
  );
};

export default GovFields;
