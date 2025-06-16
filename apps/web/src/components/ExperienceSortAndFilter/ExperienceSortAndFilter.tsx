import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { ReactNode, useEffect } from "react";

import { formMessages, uiMessages } from "@gc-digital-talent/i18n";
import { Select } from "@gc-digital-talent/forms";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "@gc-digital-talent/graphql";

import experienceMessages from "~/messages/experienceMessages";

type SortOptions = "date_desc" | "title_asc";
type FilterOptions =
  | "none"
  | NonNullable<AwardExperience["__typename"]>
  | NonNullable<CommunityExperience["__typename"]>
  | NonNullable<EducationExperience["__typename"]>
  | NonNullable<PersonalExperience["__typename"]>
  | NonNullable<WorkExperience["__typename"]>;

export interface FormValues {
  sortBy: SortOptions;
  filterBy: FilterOptions;
}

interface ExperienceSortAndFilterProps {
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

  useEffect(() => {
    const subscription = watch((watchValues) =>
      onChange({
        sortBy: watchValues.sortBy ?? initialFormValues.sortBy,
        filterBy: watchValues.filterBy ?? initialFormValues.filterBy,
      }),
    );
    return () => subscription.unsubscribe();
  }, [initialFormValues, onChange, watch]);

  const sortOptions: {
    value: FormValues["sortBy"];
    label: ReactNode;
  }[] = [
    {
      value: "date_desc",
      label: intl.formatMessage(formMessages.byDateDescending),
    },
    {
      value: "title_asc",
      label: intl.formatMessage(formMessages.byTitleAscending),
    },
  ];

  const filterOptions: {
    value: FormValues["filterBy"];
    label: ReactNode;
  }[] = [
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
      <div className="flex items-center gap-x-3">
        <Select
          id="sortBy"
          label={intl.formatMessage({
            defaultMessage: "Sort experience by",
            id: "2n0e2i",
            description: "Label for selector to choose experience sort options",
          })}
          name="sortBy"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          options={sortOptions}
          trackUnsaved={false}
        />
        <Select
          id="filterBy"
          label={intl.formatMessage({
            defaultMessage: "Filter experience by type",
            id: "PE7mMC",
            description:
              "Label for selector to choose experience filter options",
          })}
          name="filterBy"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          options={filterOptions}
          trackUnsaved={false}
        />
      </div>
    </FormProvider>
  );
};

export default ExperienceSortAndFilter;
