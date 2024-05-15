import { useIntl } from "react-intl";

import { Combobox, enumToOptions } from "@gc-digital-talent/forms";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { SkillCategory, SkillFamily } from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";
import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";

export type FormValues = {
  skillFamilies?: string[];
  skillCategories?: SkillCategory[];
};

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
          label={intl.formatMessage(adminMessages.category)}
          options={enumToOptions(SkillCategory).map(({ value, label }) => ({
            value,
            label,
          }))}
        />
      </div>
    </FilterDialog>
  );
};

export default SkillFilterDialog;
