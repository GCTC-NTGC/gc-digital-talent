import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import { useIntl } from "react-intl";
import WorkExperienceForm from "./WorkExperienceForm";
import getExperienceFormLabels from "../experienceForm/labels";

export default {
  component: WorkExperienceForm,
  title: "WorkExperienceForm",
} as Meta;

const TemplateWorkExperienceForm: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "work");
  return (
    <Form onSubmit={action("submit")}>
      <WorkExperienceForm labels={labels} />
      <Submit />
    </Form>
  );
};

export const IndividualWorkExperience = TemplateWorkExperienceForm.bind({});
