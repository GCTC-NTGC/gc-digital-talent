import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { BasicForm } from "@common/components/form";
import { fakeUsers } from "@common/fakeData";
import { LanguageInformationForm, FormValues } from "./LanguageInformationForm";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

export default {
  component: LanguageInformationForm,
  title: "Language Information Form",
} as Meta;

const TemplateLangInfoForm: Story = () => {
  const self = fakeUsers()[0];

  return (
    <ProfileFormWrapper
      description="Use the form below to help us better understand your language preferences and capabilities"
      title="Language Information"
      crumbs={[
        {
          title: "Language Information",
        },
      ]}
    >
      <BasicForm
        onSubmit={async (data: FormValues) => {
          action("submit")(data);
        }}
      >
        <LanguageInformationForm self={self} />
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export const IndividualLanguageInfo = TemplateLangInfoForm.bind({});
