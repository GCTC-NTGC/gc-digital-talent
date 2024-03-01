import React from "react";
import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import { Combobox, enumToOptions } from "@gc-digital-talent/forms";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  SkillCategory,
  SkillFamily,
  graphql,
} from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";
import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";

export type FormValues = {
  skillFamilies?: string[];
  skillCategories?: SkillCategory[];
};

const SkillFilterDialogData_Query = graphql(/* GraphQL */ `
  query SkillFilterDialogData {
    skillFamilies {
      id
      key
      name {
        en
        fr
      }
    }
  }
`);

const context: Partial<OperationContext> = {
  additionalTypenames: ["SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

type SkillFilterDialogProps = CommonFilterDialogProps<FormValues>;

const SkillFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: SkillFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = useQuery({
    query: SkillFilterDialogData_Query,
    context,
  });

  const skillFamilies: SkillFamily[] = unpackMaybes(data?.skillFamilies);

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
