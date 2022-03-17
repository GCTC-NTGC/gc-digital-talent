import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import PersonalExperienceForm from "./PersonalExperienceForm";

export default {
  component: PersonalExperienceForm,
  title: "PersonalExperienceForm",
} as Meta;

const TemplatePersonalExperienceForm: Story = () => {
  return (
    <Form onSubmit={action("submit")}>
      <PersonalExperienceForm />
      <Submit />
    </Form>
  );
};

export const IndividualPersonalExperience = TemplatePersonalExperienceForm.bind(
  {},
);
