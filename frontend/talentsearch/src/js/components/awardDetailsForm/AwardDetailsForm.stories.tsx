import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import { useIntl } from "react-intl";
import AwardDetailsForm from "./AwardDetailsForm";
import getExperienceFormLabels from "../experienceForm/labels";

export default {
  component: AwardDetailsForm,
  title: "AwardDetailsForm",
} as Meta;

const TemplateAwardDetailsForm: Story = () => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "award");
  return (
    <Form onSubmit={action("submit")}>
      <AwardDetailsForm labels={labels} />
      <Submit />
    </Form>
  );
};

export const IndividualAwardDetails = TemplateAwardDetailsForm.bind({});
