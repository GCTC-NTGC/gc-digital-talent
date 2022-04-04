import React from "react";
import { Meta, Story } from "@storybook/react";
import LangInfoFormContainer from "./LanguageInformationForm";

export default {
  component: LangInfoFormContainer,
  title: "Language Information Form",
} as Meta;

const TemplateLangInfoForm: Story = () => {
  return <LangInfoFormContainer />;
};

export const IndividualLanguageInfo = TemplateLangInfoForm.bind({});
