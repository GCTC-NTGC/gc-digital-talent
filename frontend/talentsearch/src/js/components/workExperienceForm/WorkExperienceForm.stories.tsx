import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import WorkExperienceForm from "./WorkExperienceForm";

export default {
  component: WorkExperienceForm,
  title: "WorkExperienceForm",
} as Meta;

const TemplateWorkExperienceForm: Story = () => {
  return (
    <Form onSubmit={action("submit")}>
      <WorkExperienceForm />
      <Submit />
    </Form>
  );
};

export const IndividualWorkExperience = TemplateWorkExperienceForm.bind({});
