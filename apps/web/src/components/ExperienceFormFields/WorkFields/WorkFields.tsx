import { useIntl, defineMessage, MessageDescriptor } from "react-intl";
import { useQuery } from "urql";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";

import {
  FieldLabels,
  Input,
  Radio,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Loading } from "@gc-digital-talent/ui";
import {
  EmploymentCategory,
  graphql,
  WorkFieldOptionsQuery,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { SubExperienceFormProps, WorkFormValues } from "~/types/experience";
import ExperienceWorkStreams from "~/components/ExperienceWorkStreams/ExperienceWorkStreams";

import CafFields from "./CafFields";
import ExternalFields from "./ExternalFields";
import GovFields from "./GovFields";

const WorkFieldOptions_Query = graphql(/* GraphQL */ `
  query WorkFieldOptions {
    employmentCategoryTypes: localizedEnumStrings(
      enumName: "EmploymentCategory"
    ) {
      value
      label {
        en
        fr
      }
    }
    communities {
      ...ExperienceWorkStreamsCommunity
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

const WorkFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<WorkFieldOptionsQuery>({
    query: WorkFieldOptions_Query,
  });

  const communities = unpackMaybes(data?.communities);

  const { resetField, formState } = useFormContext<WorkFormValues>();

  const prevEmploymentCategory = useRef<EmploymentCategory | null | undefined>(
    formState.defaultValues?.employmentCategory,
  );
  const watchEmploymentCategory = useWatch<{
    employmentCategory: EmploymentCategory;
  }>({ name: "employmentCategory" });

  const employmentCategories: Radio[] = unpackMaybes(
    data?.employmentCategoryTypes,
  ).map(({ value, label }) => {
    const contentBelow =
      employmentCategoryDescriptions[value as EmploymentCategory];
    return {
      label: getLocalizedName(label, intl),
      value,
      contentBelow: intl.formatMessage(contentBelow),
    };
  });

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
        <div
          data-h2-margin="base(x.5, 0, 0, 0)"
          data-h2-max-width="base(50rem)"
        >
          <div data-h2-flex-grid="base(flex-start, x2, x1)">
            <div data-h2-flex-item="base(1of1)">
              <Input
                id="role"
                label={labels.role}
                name="role"
                type="text"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
            <div data-h2-flex-item="base(1of1)">
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
            <div data-h2-flex-item="base(1of1)">
              <ExperienceWorkStreams communitiesQuery={communities} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkFields;
