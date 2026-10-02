import type { MessageDescriptor } from "react-intl";
import { useIntl, defineMessage } from "react-intl";
import { useQuery } from "urql";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";

import type { FieldLabels, Radio } from "@gc-digital-talent/forms";
import {
  DATE_SEGMENT,
  DateInput,
  Input,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import type { Locales } from "@gc-digital-talent/i18n";
import {
  errorMessages,
  narrowEnumType,
  getLocale,
} from "@gc-digital-talent/i18n";
import { Loading, Notice } from "@gc-digital-talent/ui";
import type { WorkFieldOptionsQuery } from "@gc-digital-talent/graphql";
import { EmploymentCategory, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes, nodeToString } from "@gc-digital-talent/helpers";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import type {
  SubExperienceFormProps,
  WorkFormValues,
} from "~/types/experience";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import CafFields from "./CafFields";
import ExternalFields from "./ExternalFields";
import GovFields from "./GovFields";

const WorkFieldOptions_Query = graphql(/* GraphQL */ `
  query WorkFieldOptions {
    employmentCategoryTypes: localizedEnumOptions(
      enumName: "EmploymentCategory"
    ) {
      ... on LocalizedEmploymentCategory {
        value
        label {
          localized
        }
      }
    }
  }
`);

const EmploymentCategoryFields = ({
  employmentCategory,
  labels,
  organizationSuggestions,
}: {
  employmentCategory: EmploymentCategory;
  labels: FieldLabels;
  organizationSuggestions: string[];
}) => {
  switch (employmentCategory) {
    case EmploymentCategory.CanadianArmedForces:
      return <CafFields labels={labels} />;
    case EmploymentCategory.ExternalOrganization:
      return (
        <ExternalFields
          labels={labels}
          organizationSuggestions={organizationSuggestions}
        />
      );
    case EmploymentCategory.GovernmentOfCanada:
      return <GovFields labels={labels} />;
    default:
      return null;
  }
};

const employmentCategoryDescriptions: Record<
  EmploymentCategory,
  MessageDescriptor
> = {
  EXTERNAL_ORGANIZATION: defineMessage({
    defaultMessage:
      "This role had no affiliation with the Government of Canada.",
    id: "Tf8eTw",
    description:
      "Description for the external employment category option in work experience",
  }),
  GOVERNMENT_OF_CANADA: defineMessage({
    defaultMessage:
      "This was a role as an employee or a contractor at a Government department or agency.",
    id: "bdZCom",
    description:
      "Description for the goc employment category option in work experience",
  }),
  CANADIAN_ARMED_FORCES: defineMessage({
    defaultMessage:
      "This was a role in the regular or reserve force of the Canadian Army, the Royal Canadian Air Force, or the Royal Canadian Navy.",
    id: "dPAsNx",
    description:
      "Description for the caf employment category option in work experience",
  }),
};

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

const WorkFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const [{ data, fetching }] = useQuery<WorkFieldOptionsQuery>({
    query: WorkFieldOptions_Query,
  });

  const { resetField, formState } = useFormContext<WorkFormValues>();

  const todayDate = new Date();
  // to toggle whether End date is required, the state of the role status radio must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch<WorkFormValues>({ name: "roleStatus" }) !== "past";
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch<WorkFormValues>({ name: "startDate" });

  const prevEmploymentCategory = useRef<EmploymentCategory | null | undefined>(
    formState.defaultValues?.employmentCategory,
  );
  const watchEmploymentCategory = useWatch<{
    employmentCategory: EmploymentCategory;
  }>({ name: "employmentCategory" });

  const employmentCategories: Radio[] = narrowEnumType(
    unpackMaybes(data?.employmentCategoryTypes),
    "EmploymentCategory",
  ).map(({ value, label }) => {
    const contentBelow = employmentCategoryDescriptions[value];
    return {
      label: label.localized,
      value,
      contentBelow: intl.formatMessage(contentBelow),
    };
  });

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  /**
   * Reset endDate when roleStatus field is changed
   */
  useEffect(() => {
    resetField("endDate", {
      keepDirty: false,
      defaultValue: null,
    });
  }, [resetField, isCurrent]);

  /**
   * Reset all fields when employmentCategory field is changed
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof WorkFormValues) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    if (prevEmploymentCategory.current !== watchEmploymentCategory) {
      resetDirtyField("team"); // both external and goc

      // external fields
      resetDirtyField("organization");
      resetDirtyField("extSizeOfOrganization");
      resetDirtyField("extRoleSeniority");
      resetDirtyField("supervisoryPosition");
      resetDirtyField("supervisedEmployees");
      resetDirtyField("supervisedEmployeesNumber");
      resetDirtyField("budgetManagement");
      resetDirtyField("annualBudgetAllocation");
      resetDirtyField("seniorManagementStatus");
      resetDirtyField("cSuiteRoleTitle");
      resetDirtyField("otherCSuiteRoleTitle");

      // goc fields
      resetDirtyField("department");
      resetDirtyField("govEmploymentType");
      resetDirtyField("govPositionType");
      resetDirtyField("govContractorRoleSeniority");
      resetDirtyField("govContractorType");
      resetDirtyField("contractorFirmAgencyName");
      resetDirtyField("classificationGroup");
      resetDirtyField("classificationLevel");
      resetDirtyField("supervisoryPosition");
      resetDirtyField("supervisedEmployees");
      resetDirtyField("supervisedEmployeesNumber");
      resetDirtyField("budgetManagement");
      resetDirtyField("annualBudgetAllocation");
      resetDirtyField("seniorManagementStatus");
      resetDirtyField("cSuiteRoleTitle");
      resetDirtyField("otherCSuiteRoleTitle");

      // caf fields
      resetDirtyField("cafEmploymentType");
      resetDirtyField("cafForce");
      resetDirtyField("cafRank");
    }

    prevEmploymentCategory.current = watchEmploymentCategory;
  }, [watchEmploymentCategory, resetField]);

  return (
    <div>
      {fetching ? (
        <Loading inline />
      ) : (
        <>
          <div className="grid gap-6">
            <Input
              id="role"
              label={labels.jobTitle}
              name="role"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <RadioGroup
              idPrefix="roleStatus"
              name="roleStatus"
              legend={labels.roleStatus}
              items={[
                {
                  value: "active",
                  label: labels.activeRole,
                },
                {
                  value: "past",
                  label: labels.pastRole,
                },
              ]}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
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
                  message: intl.formatMessage(
                    errorMessages.mustNotBeFutureStartDate,
                  ),
                },
              }}
            />
            {/* conditionally render the end-date based off the state attached to the radio input */}
            {!isCurrent && (
              <DateInput
                id="endDate"
                legend={labels.endDate}
                name="endDate"
                show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
                round="ceil"
                rules={
                  isCurrent
                    ? {}
                    : {
                        required: intl.formatMessage(errorMessages.required),
                        min: {
                          value: watchStartDate ? String(watchStartDate) : "",
                          message: intl.formatMessage(
                            errorMessages.minDateSelfLabel,
                            {
                              labelSelf: nodeToString(
                                labels.endDate,
                              ).toLowerCase(),
                              labelAssociated: nodeToString(
                                labels.startDate,
                              ).toLowerCase(),
                            },
                          ),
                        },
                        max: {
                          value: strToFormDate(todayDate.toISOString()),
                          message: intl.formatMessage(
                            errorMessages.mustNotBeFutureEndDate,
                          ),
                        },
                      }
                }
              />
            )}
            <RadioGroup
              idPrefix="employmentCategory"
              name="employmentCategory"
              legend={intl.formatMessage({
                defaultMessage: "Employment category",
                id: "BdpXAF",
                description: "Label for the employment category radio group",
              })}
              items={employmentCategories}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />

            {watchEmploymentCategory ? (
              <>
                <EmploymentCategoryFields
                  employmentCategory={watchEmploymentCategory}
                  labels={labels}
                  organizationSuggestions={organizationSuggestions}
                />
                <p>{experienceLabels.keyTasksDescription}</p>
                <TextArea
                  id={"details"}
                  name={"details"}
                  rows={TEXT_AREA_ROWS}
                  wordLimit={wordCountLimits[locale]}
                  label={experienceLabels.keyTasksAndResponsibilities}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </>
            ) : (
              <Notice.Root>
                <Notice.Content>
                  <p className="text-center">
                    {intl.formatMessage({
                      defaultMessage:
                        "Please select an employment category to continue.",
                      id: "wdvv4j",
                      description:
                        "Text displayed on the work experience form when a user has not selected an employment category.",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkFields;
