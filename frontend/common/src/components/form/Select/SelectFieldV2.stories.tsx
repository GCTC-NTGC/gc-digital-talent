import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { uniqueId } from "lodash";
import React from "react";
import BasicForm from "../BasicForm";
import Submit from "../Submit";
import SelectFieldV2 from "./SelectFieldV2";

export default {
  component: SelectFieldV2,
  title: "Form/SelectFieldV2",
  decorators: [
    (Story) => {
      return (
        <BasicForm
          onSubmit={action("Submit Form")}
          options={{ defaultValues: { department: "" } }}
        >
          {/* See: https://github.com/storybookjs/storybook/issues/12596#issuecomment-723440097 */}
          {Story() /* Can't use <Story /> for inline decorator. */}
          <Submit />
        </BasicForm>
      );
    },
  ],
} as ComponentMeta<typeof SelectFieldV2>;

const Template: ComponentStory<typeof SelectFieldV2> = (args) => {
  return <SelectFieldV2 {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  id: uniqueId(),
  label: "Department",
  name: "department",
  options: [
    { value: 1, label: "CRA" },
    { value: 2, label: "TBS" },
    { value: 3, label: "DND" },
  ],
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  rules: { required: true },
};

export const RequiredWithCustomMessage = Template.bind({});
RequiredWithCustomMessage.args = {
  ...Default.args,
  rules: { required: "You must enter a department to continue." },
};

export const RequiredWithContextInfo = Template.bind({});
RequiredWithContextInfo.args = {
  ...Default.args,
  rules: { required: true },
  context: "We collect department data for account purposes.",
};
