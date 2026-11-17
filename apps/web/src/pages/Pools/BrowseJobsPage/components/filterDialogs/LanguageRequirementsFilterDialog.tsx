import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { Checklist, localizedEnumToOptions } from "@gc-digital-talent/forms";
import { sortLanguageAbility } from "@gc-digital-talent/i18n";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

const LanguageRequirementsFilterDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment LanguageRequirementsFilterDialogOptions on Query {
    languageAbilityEnums: localizedEnumStrings(enumName: "LanguageAbility") {
      value
      label {
        localized
      }
    }
  }
`);

interface FormValues {
  languageRequirements: string[];
}

interface Props {
  optionsQuery: FragmentType<
    typeof LanguageRequirementsFilterDialogOptions_Fragment
  >;
  children: ReactNode;
}

const LanguageRequirementsFilterDialog = ({
  optionsQuery,
  children,
}: Props) => {
  const intl = useIntl();
  const { languageAbilityEnums } = getFragment(
    LanguageRequirementsFilterDialogOptions_Fragment,
    optionsQuery,
  );
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
        languageRequirements: getFilterValues("languageRequirements"),
      })}
      onSave={(formValues) =>
        setFilters({ languageRequirements: formValues.languageRequirements })
      }
      onClear={() => setFilters({ languageRequirements: null })}
    >
      <Checklist
        idPrefix={"languageRequirements"}
        legend={intl.formatMessage({
          defaultMessage: "Language requirements",
          id: "nEE/Ds",
          description: "Title for a language requirements filter dialog",
        })}
        items={languageRequirementOptions}
        name={"languageRequirements"}
      />
    </FilterDialog>
  );
};

export default LanguageRequirementsFilterDialog;
