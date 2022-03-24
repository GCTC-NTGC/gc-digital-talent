import React from "react";
import { Meta, Story } from "@storybook/react";
import GovInfoFormContainer from "./GovernmentInfoForm";

export default {
  component: GovInfoFormContainer,
  title: "Government Info Form",
} as Meta;

const TemplateGovInfoForm: Story = () => {
  return <GovInfoFormContainer />;
};

export const IndividualGovernmentInfo = TemplateGovInfoForm.bind({});
