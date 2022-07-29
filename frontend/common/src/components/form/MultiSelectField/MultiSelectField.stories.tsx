import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";
import BasicForm from "../BasicForm";
import Submit from "../Submit";
import MultiSelectField from "./MultiSelectField";

export default {
  component: MultiSelectField,
  title: "Form/MultiSelectField",
  decorators: [
    (Story, context) => {
      return (
        <BasicForm
          onSubmit={action("Submit Form")}
          options={{
            defaultValues: {
              // Sets default value based on logic for how `name` attribute inherits inside component.
              [context.args.name || context.args.id]: [],
            },
          }}
        >
          {/* See: https://github.com/storybookjs/storybook/issues/12596#issuecomment-723440097 */}
          {Story() /* Can't use <Story /> for inline decorator. */}
          <Submit />
        </BasicForm>
      );
    },
  ],
} as ComponentMeta<typeof MultiSelectField>;

const Template: ComponentStory<typeof MultiSelectField> = (args) => {
  return <MultiSelectField {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  id: "departments",
  label: "Departments",
  options: [
    { value: "cra", label: "CRA" },
    { value: "tbs", label: "TBS" },
    { value: "dnd", label: "DND" },
  ],
};

export const NameAttrOverride = Template.bind({});
NameAttrOverride.args = {
  ...Default.args,
  name: "departmentsField",
};

export const NoOptions = Template.bind({});
NoOptions.args = {
  ...Default.args,
  options: [],
};

export const NoOptionsAndLoading = Template.bind({});
NoOptionsAndLoading.args = {
  ...Default.args,
  options: [],
  isLoading: true,
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithInfo = Template.bind({});
RequiredWithInfo.args = {
  ...Default.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithError = Template.bind({});
RequiredWithError.args = {
  ...Default.args,
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithErrorAndContext = Template.bind({});
RequiredWithErrorAndContext.args = {
  ...Default.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};
