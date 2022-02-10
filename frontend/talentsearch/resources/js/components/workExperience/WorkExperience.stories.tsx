import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import WorkExperience from "./WorkExperience";

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
