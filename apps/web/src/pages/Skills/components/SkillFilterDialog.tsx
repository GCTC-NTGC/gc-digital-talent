import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Combobox, localizedEnumToOptions } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType, SkillCategory } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";
import type { CommonFilterDialogProps } from "~/components/FilterDialog/FilterDialog";
import FilterDialog from "~/components/FilterDialog/FilterDialog";

export const SkillFilterFamily_Fragment = graphql(/* GraphQL */ `
  fragment SkillFilterFamily on SkillFamily {
    key
    name {
      localized
    }
  }
`);

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

interface SkillFilterDialogProps extends CommonFilterDialogProps<FormValues> {
  query: FragmentType<typeof SkillFilterFamily_Fragment>[];
  fetching?: boolean;
}

const SkillFilterDialog = ({
  query,
  fetching,
  initialValues,
  resetValues,
  onSubmit,
}: SkillFilterDialogProps) => {
  const intl = useIntl();
  const skillFamilies = getFragment(SkillFilterFamily_Fragment, query);
  const [{ data, fetching: optionsFetching }] = useQuery({
    query: SkillFilterOptions_Query,
  });

  return (
    <FilterDialog<FormValues>
      {...{ onSubmit, resetValues }}
      options={{ defaultValues: initialValues }}
    >
      <div className="grid gap-6">
        <Combobox
          id="skillFamilies"
          name="skillFamilies"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.skillFamilies)}
          doNotSort
          options={skillFamilies.map(({ key, name }) => ({
            value: key,
            label:
              name?.localized ??
              intl.formatMessage(commonMessages.notAvailable),
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
