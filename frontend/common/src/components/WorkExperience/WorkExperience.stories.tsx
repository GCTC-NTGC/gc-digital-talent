import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { Checkbox } from "../form/Checkbox";
import { Input } from "../form/Input";
import WorkExperience from "./WorkExperience";
import Form from "../form/BasicForm";
import Submit from "../form/Submit";

export default {
  component: WorkExperience,
  title: "WorkExperience",
} as Meta;

const TemplateWorkExperience: Story = () => {
  return (
    <Form onSubmit={action("submit")}>
      <WorkExperience />
      <Submit />
    </Form>
  );
};

export const IndividualWorkExperience = TemplateWorkExperience.bind({});
