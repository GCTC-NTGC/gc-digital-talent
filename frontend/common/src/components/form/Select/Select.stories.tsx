import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";
import { getLocalizedName } from "../../../helpers/localize";
import { fakeDepartments } from "../../../fakeData";
import Form from "../BasicForm";
import Select, { OptGroup, Option } from ".";
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
      options={{ defaultValues: { departments: "" } }}
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
  const groups = [
    {
      id: 1,
      label: {
        en: "Small",
        fr: "Petit",
      },
      options: fakeDepartments().map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
    {
      id: 2,
      label: {
        en: "Medium",
        fr: "Moyen",
      },
      options: fakeDepartments().map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
    {
      id: 3,
      label: {
        en: "Large",
        fr: "Grand",
      },
      options: fakeDepartments().map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
  ];
  const departmentOptions: OptGroup[] = groups.map((optgroup) => ({
    label: getLocalizedName(optgroup.label, intl),
    options: optgroup.options,
  }));

  return (
    <Form
      onSubmit={action("Submit Form")}
      options={{ defaultValues: { departments: "" } }}
    >
      <div>
        <Select {...args} options={departmentOptions} />
        <Submit />
      </div>
    </Form>
  );
};

export const SelectDefault = Template.bind({});
SelectDefault.args = {
  id: uniqueId(),
  label: "Department",
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
