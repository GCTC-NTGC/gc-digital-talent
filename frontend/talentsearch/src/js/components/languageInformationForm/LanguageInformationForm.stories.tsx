import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { BasicForm } from "@common/components/form";
import { fakeUsers } from "@common/fakeData";
import {
  LanguageInformationForm,
  FormValues,
  dataToFormValues,
} from "./LanguageInformationForm";

export default {
  component: LanguageInformationForm,
  title: "Language Information Form",
} as Meta;

const TemplateLangInfoForm: Story = (args) => {
  const argumentData = {
    ...args,
    email: "test@123.ca",
    id: "lsdkgjo3844o8tuorjf",
  };

  return (
    <BasicForm
      onSubmit={async (data: FormValues) => {
        action("submit")(data);
      }}
      options={{
        defaultValues: dataToFormValues(argumentData),
      }}
    >
      <LanguageInformationForm />
    </BasicForm>
  );
};

export const LanguageInfoForm = TemplateLangInfoForm.bind({});

LanguageInfoForm.args = {
  ...fakeUsers()[1],
};
