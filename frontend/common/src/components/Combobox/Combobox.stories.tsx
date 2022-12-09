import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "../../fakeData";

import Combobox from "./Combobox";
import BasicForm from "../form/BasicForm";
import Submit from "../form/Submit";

const skills = getStaticSkills().map((skill) => ({
  value: skill.id,
  label: skill.name.en,
}));

const defaultArgs = {
  name: "skill",
  label: "Find a skill",
  options: skills,
};

export default {
  component: Combobox,
  title: "Components/Combobox",
} as ComponentMeta<typeof Combobox>;

const Template: ComponentStory<typeof Combobox> = (args) => (
  <BasicForm
    onSubmit={action("onSubmit")}
    options={{ defaultValues: { skill: "" } }}
  >
    <Combobox {...args} />
    <Submit />
  </BasicForm>
);

export const Default = Template.bind({});
Default.args = defaultArgs;

export const Required = Template.bind({});
Required.args = {
  ...defaultArgs,
  rules: { required: "This field is required" },
};
