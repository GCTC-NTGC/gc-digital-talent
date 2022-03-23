import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { fakeClassifications } from "@common/fakeData";
import GovernmentInfoForm, { FormValues } from "./GovernmentInfoForm";

export default {
  component: GovernmentInfoForm,
  title: "Government Info Form",
} as Meta;

const TemplateGovInfoForm: Story = () => {
  return (
    <GovernmentInfoForm
      classifications={fakeClassifications()}
      handleSubmit={async (data: FormValues) => {
        action("submit")(data);
      }}
    />
  );
};

export const IndividualGovernmentInfo = TemplateGovInfoForm.bind({});
