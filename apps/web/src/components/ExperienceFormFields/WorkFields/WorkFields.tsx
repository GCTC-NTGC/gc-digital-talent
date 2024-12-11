import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

import {
  FieldLabels,
  Input,
  localizedEnumToOptions,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Loading } from "@gc-digital-talent/ui";
import {
  EmploymentCategory,
  graphql,
  WorkFieldOptionsQuery,
} from "@gc-digital-talent/graphql";

import { SubExperienceFormProps, WorkFormValues } from "~/types/experience";

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
  }
`);

const EmploymentCategoryFields = ({
  employmentCategory,
  labels,
}: {
  employmentCategory: EmploymentCategory;
  labels: FieldLabels;
}) => {
  switch (employmentCategory) {
    case EmploymentCategory.CanadianArmedForces:
      return <CafFields labels={labels} />;
    case EmploymentCategory.ExternalOrganization:
      return <ExternalFields labels={labels} />;
    case EmploymentCategory.GovernmentOfCanada:
      return <GovFields labels={labels} />;
    default:
      return null;
  }
};

const WorkFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<WorkFieldOptionsQuery>({
    query: WorkFieldOptions_Query,
  });

  const { resetField, formState } = useFormContext<WorkFormValues>();

  const watchEmploymentCategory = useWatch<{
    employmentCategory: EmploymentCategory;
  }>({
    name: "employmentCategory",
  });

  //
  /**
   * Reset all fields when employmentCategory field is changed
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof WorkFormValues) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    if (formState.dirtyFields.employmentCategory) {
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

      // caf fields
      resetDirtyField("cafEmploymentType");
      resetDirtyField("cafForce");
      resetDirtyField("cafRank");

      // all categories
      resetDirtyField("startDate");
      resetDirtyField("currentRole");
      resetDirtyField("endDate");
    }
  }, [formState.dirtyFields, watchEmploymentCategory, resetField]);

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
                items={localizedEnumToOptions(
                  data?.employmentCategoryTypes,
                  intl,
                )}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
            <EmploymentCategoryFields
              employmentCategory={watchEmploymentCategory}
              labels={labels}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkFields;
