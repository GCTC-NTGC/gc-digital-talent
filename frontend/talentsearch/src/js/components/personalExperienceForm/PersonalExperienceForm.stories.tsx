import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import { useIntl } from "react-intl";
import PersonalExperienceForm from "./PersonalExperienceForm";
import getExperienceFormLabels from "../experienceForm/labels";

export default {
  component: PersonalExperienceForm,
  title: "PersonalExperienceForm",
} as Meta;

const TemplatePersonalExperienceForm: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "personal");
  return (
    <Form onSubmit={action("submit")}>
      <PersonalExperienceForm labels={labels} />
      <Submit />
    </Form>
  );
};

export const IndividualPersonalExperience = TemplatePersonalExperienceForm.bind(
  {},
);
