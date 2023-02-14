import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";
import { getLocalizedName } from "../../../helpers/localize";
import { fakeDepartments } from "../../../fakeData";
import Form from "../BasicForm";
import Select, { Option } from ".";
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

const TemplateSelect: Story<SelectProps> = (args) => {
  const intl = useIntl();
  const departmentOptions: Option[] = fakeDepartments().map(({ id, name }) => ({
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

export const SelectDefault = TemplateSelect.bind({});
SelectDefault.args = {
  id: uniqueId(),
  label: "Department",
  name: "departments",
  nullSelection: "",
};

export const SelectWithNullSelection = TemplateSelect.bind({});
SelectWithNullSelection.args = {
  ...SelectDefault.args,
  nullSelection: "Select an option...",
};

export const SelectRequired = TemplateSelect.bind({});
SelectRequired.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithInfo = TemplateSelect.bind({});
SelectRequiredWithInfo.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithError = TemplateSelect.bind({});
SelectRequiredWithError.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithErrorAndContext = TemplateSelect.bind({});
SelectRequiredWithErrorAndContext.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectLabelElement = TemplateSelect.bind({});
SelectLabelElement.args = {
  label: <span data-h2-font-weight="base(700)">Bold Label</span>,
  name: "LabelElement",
};
