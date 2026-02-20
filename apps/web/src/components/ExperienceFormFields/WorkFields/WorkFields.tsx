import { useIntl, defineMessage, MessageDescriptor } from "react-intl";
import { useQuery } from "urql";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";

import {
  FieldLabels,
  Input,
  Radio,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  getLocalizedName,
  narrowEnumType,
  getLocale,
  Locales,
} from "@gc-digital-talent/i18n";
import { Heading, Loading } from "@gc-digital-talent/ui";
import {
  EmploymentCategory,
  graphql,
  WorkFieldOptionsQuery,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { SubExperienceFormProps, WorkFormValues } from "~/types/experience";
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
          en
          fr
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
      "This was a role as an employee or a contractor at a Government of Canada department, agency, or crown corporation.",
    id: "9XTtxd",
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
      label: getLocalizedName(label, intl),
      value,
      contentBelow: intl.formatMessage(contentBelow),
    };
  });

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

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
          <div className="grid gap-6 xs:grid-cols-2">
            <div className="col-span-2">
              <Input
                id="role"
                label={labels.role}
                name="role"
                type="text"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
            <div className="col-span-2">
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
            </div>
            <EmploymentCategoryFields
              employmentCategory={watchEmploymentCategory}
              labels={labels}
              organizationSuggestions={organizationSuggestions}
            />
          </div>
          <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
            {intl.formatMessage({
              defaultMessage: "Highlight additional details",
              id: "6v+j79",
              description: "Title for additional details section",
            })}
          </Heading>
          <div>
            <p className="mb-6">
              {intl.formatMessage({
                defaultMessage:
                  "Describe <strong>key tasks</strong>, <strong>responsibilities</strong>, or <strong>other information</strong> you feel were crucial in making this experience important. Try to keep this field concise as you'll be able to provide more detailed information when linking skills to this experience.",
                id: "yZ0kfQ",
                description:
                  "Help text for the experience additional details field",
              })}
            </p>
            <TextArea
              id={"details"}
              name={"details"}
              rows={TEXT_AREA_ROWS}
              wordLimit={wordCountLimits[locale]}
              label={experienceLabels.details}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WorkFields;
