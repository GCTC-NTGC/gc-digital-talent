import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import EducationExperienceForm from "./EducationExperienceForm";

export default {
  component: EducationExperienceForm,
  title: "EducationExperienceForm",
} as Meta;

const TemplateEducationExperienceForm: Story = () => {
  return (
    <Form onSubmit={action("submit")}>
      <EducationExperienceForm />
      <Submit />
    </Form>
  );
};

export const IndividualEducationExperience =
  TemplateEducationExperienceForm.bind({});
