import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  SkillCategory,
  SkillFamily,
  graphql,
} from "@gc-digital-talent/graphql";
import Combobox from "@gc-digital-talent/forms/Combobox";
import { localizedEnumToOptions } from "@gc-digital-talent/forms/utils";

import adminMessages from "~/messages/adminMessages";
import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";

const SkillFilterOptions_Query = graphql(/* GraphQL */ `
  query SkillFilterOptions {
    categories: localizedEnumStrings(enumName: "SkillCategory") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export interface FormValues {
  skillFamilies?: string[];
  skillCategories?: SkillCategory[];
}

type SkillFilterDialogProps = CommonFilterDialogProps<FormValues> & {
  skillFamilies: SkillFamily[];
  fetching?: boolean;
};

const SkillFilterDialog = ({
  skillFamilies,
  fetching,
  initialValues,
  resetValues,
  onSubmit,
}: SkillFilterDialogProps) => {
  const intl = useIntl();
  const [{ data, fetching: optionsFetching }] = useQuery({
    query: SkillFilterOptions_Query,
  });

  return (
    <FilterDialog<FormValues>
      {...{ onSubmit, resetValues }}
      options={{ defaultValues: initialValues }}
    >
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr)"
        data-h2-gap="base(x1)"
      >
        <Combobox
          id="skillFamilies"
          name="skillFamilies"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.skillFamilies)}
          doNotSort
          options={skillFamilies.map(({ key, name }) => ({
            value: key,
            label: getLocalizedName(name, intl),
          }))}
        />
        <Combobox
          id="skillCategories"
          name="skillCategories"
          isMulti
          fetching={optionsFetching}
          label={intl.formatMessage(adminMessages.category)}
          options={localizedEnumToOptions(data?.categories, intl)}
        />
      </div>
    </FilterDialog>
  );
};

export default SkillFilterDialog;
