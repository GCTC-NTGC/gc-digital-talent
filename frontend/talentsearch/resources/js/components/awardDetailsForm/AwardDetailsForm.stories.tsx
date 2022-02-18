import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import AwardDetailsForm from "./AwardDetailsForm";

export default {
  component: AwardDetailsForm,
  title: "AwardDetailsForm",
} as Meta;

const TemplateAwardDetailsForm: Story = () => {
  return (
    <Form onSubmit={action("submit")}>
      <AwardDetailsForm />
      <Submit />
    </Form>
  );
};

export const IndividualAwardDetails = TemplateAwardDetailsForm.bind({});
