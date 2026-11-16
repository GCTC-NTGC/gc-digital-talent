import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { Checklist, localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  sortLanguageAbility,
  type MaybeLocalizedEnums,
} from "@gc-digital-talent/i18n";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

interface FormValues {
  languageRequirements: string[];
}

interface Props {
  languageAbilityEnums: MaybeLocalizedEnums;
  children: ReactNode;
}

const LanguageRequirementsFilterDialog = ({
  languageAbilityEnums,
  children,
}: Props) => {
  const intl = useIntl();
  const { getFilterValues, setFilters } = useBrowseJobsSearchParams();

  const languageRequirementOptions = localizedEnumToOptions(
    sortLanguageAbility(languageAbilityEnums),
    intl,
  );

  return (
    <FilterDialog<FormValues>
      title={intl.formatMessage({
        defaultMessage: "Language requirements",
        id: "nEE/Ds",
        description: "Title for a language requirements filter dialog",
      })}
      subtitle={intl.formatMessage({
        defaultMessage: "Filter jobs by language requirements.",
        id: "NSowez",
        description: "Subtitle for a language requirements filters dialog",
      })}
      trigger={children}
      getFormValues={() => ({
        languageRequirements: getFilterValues("languageRequirement"),
      })}
      onSave={(formValues) =>
        setFilters({ languageRequirement: formValues.languageRequirements })
      }
      onClear={() => setFilters({ languageRequirement: null })}
    >
      <Checklist
        idPrefix={"languageRequirements"}
        legend={intl.formatMessage({
          defaultMessage: "Language requirements",
          id: "hzJUl5",
          description: "Title for a language requirement checklist",
        })}
        items={languageRequirementOptions}
        name={"languageRequirements"}
      />
    </FilterDialog>
  );
};

export default LanguageRequirementsFilterDialog;
