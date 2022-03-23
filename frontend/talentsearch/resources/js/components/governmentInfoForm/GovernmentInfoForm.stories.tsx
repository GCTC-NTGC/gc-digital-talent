import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { fakeClassifications } from "@common/fakeData";
import Form from "@common/components/form/BasicForm";
import GovernmentInfoForm, { FormValues } from "./GovernmentInfoForm";

export default {
  component: GovernmentInfoForm,
  title: "Government Info Form",
} as Meta;

const TemplateGovInfoForm: Story = () => {
  return (
    <Form
      onSubmit={async (data: FormValues) => {
        action("submit")(data);
      }}
    >
      <GovernmentInfoForm classifications={fakeClassifications()} />
    </Form>
  );
};

export const IndividualGovernmentInfo = TemplateGovInfoForm.bind({});
