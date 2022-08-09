import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import React from "react";
import BasicForm from "../BasicForm";
import Submit from "../Submit";
import MultiSelectFieldV2 from "./MultiSelectFieldV2";

export default {
  component: MultiSelectFieldV2,
  title: "Form/MultiSelectFieldV2",
  decorators: [
    (Story) => {
      return (
        <BasicForm
          onSubmit={action("Submit Form")}
          options={{ defaultValues: { departments: [] } }}
        >
          {/* See: https://github.com/storybookjs/storybook/issues/12596#issuecomment-723440097 */}
          {Story() /* Can't use <Story /> for inline decorator. */}
          <Submit />
        </BasicForm>
      );
    },
  ],
} as ComponentMeta<typeof MultiSelectFieldV2>;

const Template: ComponentStory<typeof MultiSelectFieldV2> = (args) => {
  return <MultiSelectFieldV2 {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  id: uniqueId(),
  label: "Departments",
  name: "departments",
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
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithContextInfo = Template.bind({});
RequiredWithContextInfo.args = {
  ...Default.args,
  rules: { required: true },
  context: "We collect the above data for account purposes.",
};
