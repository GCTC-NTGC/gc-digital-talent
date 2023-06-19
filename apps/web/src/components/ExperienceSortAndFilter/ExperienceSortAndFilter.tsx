import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { formMessages } from "@gc-digital-talent/i18n";
import { Select } from "@gc-digital-talent/forms";

import experienceMessages from "~/messages/experienceMessages";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "~/api/generated";

type SortOptions = "date_desc" | "date_asc";
type FilterOptions =
  | "none"
  | NonNullable<AwardExperience["__typename"]>
  | NonNullable<CommunityExperience["__typename"]>
  | NonNullable<EducationExperience["__typename"]>
  | NonNullable<PersonalExperience["__typename"]>
  | NonNullable<WorkExperience["__typename"]>;

export type FormValues = {
  sortBy: SortOptions;
  filterBy: FilterOptions;
};

export interface ExperienceSortAndFilterProps {
  initialFormValues: FormValues;
  onChange: (formValues: FormValues) => void;
}

const ExperienceSortAndFilter = ({
  initialFormValues,
  onChange,
}: ExperienceSortAndFilterProps) => {
  const intl = useIntl();

  const methods = useForm<FormValues>({
    defaultValues: initialFormValues,
  });
  const { watch } = methods;

  React.useEffect(() => {
    const subscription = watch((watchValues) =>
      onChange({
        sortBy: watchValues.sortBy ?? initialFormValues.sortBy,
        filterBy: watchValues.filterBy ?? initialFormValues.filterBy,
      }),
    );
    return () => subscription.unsubscribe();
  }, [initialFormValues, onChange, watch]);

  const sortOptions: Array<{
    value: FormValues["sortBy"];
    label: React.ReactNode;
  }> = [
    {
      value: "date_desc",
      label: intl.formatMessage(formMessages.byDateDescending),
    },
    {
      value: "date_asc",
      label: intl.formatMessage(formMessages.byDateAscending),
    },
  ];

  const filterOptions: Array<{
    value: FormValues["filterBy"];
    label: React.ReactNode;
  }> = [
    {
      value: "none",
      label: intl.formatMessage(formMessages.allTypes),
    },
    {
      value: "AwardExperience",
      label: intl.formatMessage(experienceMessages.award),
    },
    {
      value: "CommunityExperience",
      label: intl.formatMessage(experienceMessages.community),
    },
    {
      value: "EducationExperience",
      label: intl.formatMessage(experienceMessages.education),
    },
    {
      value: "PersonalExperience",
      label: intl.formatMessage(experienceMessages.personal),
    },
    {
      value: "WorkExperience",
      label: intl.formatMessage(experienceMessages.work),
    },
  ];

  return (
    <FormProvider {...methods}>
      <div data-h2-flex-item="base(1of1) p-tablet(content)">
        <Select
          id="sortBy"
          label={intl.formatMessage({
            defaultMessage: "Sort experience by",
            id: "2n0e2i",
            description: "Label for selector to choose experience sort options",
          })}
          name="sortBy"
          options={sortOptions}
          trackUnsaved={false}
        />
      </div>
      <div data-h2-flex-item="base(1of1) p-tablet(content)">
        <Select
          id="filterBy"
          label={intl.formatMessage({
            defaultMessage: "Filter experience by type",
            id: "PE7mMC",
            description:
              "Label for selector to choose experience filter options",
          })}
          name="filterBy"
          options={filterOptions}
          trackUnsaved={false}
        />
      </div>
    </FormProvider>
  );
};

export default ExperienceSortAndFilter;
