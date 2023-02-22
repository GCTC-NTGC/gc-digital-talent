import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { fakeDepartments, fakePools } from "@gc-digital-talent/fake-data";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Form from "../BasicForm";
import Select, { OptGroup, Option } from "./Select";
import type { SelectProps } from ".";
import Submit from "../Submit";

export default {
  component: Select,
  title: "Form/Select",
  argTypes: {
    contextToggleHandler: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const Template: Story<SelectProps> = (args) => {
  const intl = useIntl();
  const departments = fakeDepartments();
  const departmentOptions: Option[] = departments.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl) || "",
  }));
  return (
    <Form
      onSubmit={action("Submit Form")}
      options={{ defaultValues: { groups: "" } }}
    >
      <div>
        <Select {...args} options={departmentOptions} />
        <Submit />
      </div>
    </Form>
  );
};

const TemplateGroups: Story<SelectProps> = (args) => {
  const intl = useIntl();
  const departments = fakeDepartments();
  const pools = fakePools();
  const groups = [
    {
      id: 1,
      label: {
        en: "Things",
        fr: "Choses",
      },
      options: [],
    },
    {
      id: 2,
      label: {
        en: "Departments",
        fr: "Ministères",
      },
      options: departments.map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
    {
      id: 3,
      label: {
        en: "Pools",
        fr: "Bassins",
      },
      options: pools.map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
  ];
  const groupOptions: OptGroup[] = groups.map((group) => ({
    label: getLocalizedName(group.label, intl),
    options: group.options,
  }));

  return (
    <Form
      onSubmit={action("Submit Form")}
      options={{ defaultValues: { groups: "" } }}
    >
      <div>
        <Select {...args} options={groupOptions} />
        <Submit />
      </div>
    </Form>
  );
};

export const SelectDefault = Template.bind({});
SelectDefault.args = {
  id: uniqueId(),
  label: "Departments",
  name: "departments",
  nullSelection: "",
};

export const SelectWithNullSelection = Template.bind({});
SelectWithNullSelection.args = {
  ...SelectDefault.args,
  nullSelection: "Select an option...",
};

export const SelectWithGroups = TemplateGroups.bind({});
SelectWithGroups.args = {
  ...SelectDefault.args,
  label: "Groups",
  name: "groups",
  nullSelection: "Select an option...",
};

export const SelectRequired = Template.bind({});
SelectRequired.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithInfo = Template.bind({});
SelectRequiredWithInfo.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithError = Template.bind({});
SelectRequiredWithError.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithErrorAndContext = Template.bind({});
SelectRequiredWithErrorAndContext.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectLabelElement = Template.bind({});
SelectLabelElement.args = {
  label: <span data-h2-font-weight="base(700)">Bold Label</span>,
  name: "LabelElement",
};
