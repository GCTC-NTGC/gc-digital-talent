import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import { useIntl } from "react-intl";
import EducationExperienceForm from "./EducationExperienceForm";
import getExperienceFormLabels from "../experienceForm/labels";

export default {
  component: EducationExperienceForm,
  title: "EducationExperienceForm",
} as Meta;

const TemplateEducationExperienceForm: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "education");
  return (
    <Form onSubmit={action("submit")}>
      <EducationExperienceForm labels={labels} />
      <Submit />
    </Form>
  );
};

export const IndividualEducationExperience =
  TemplateEducationExperienceForm.bind({});
