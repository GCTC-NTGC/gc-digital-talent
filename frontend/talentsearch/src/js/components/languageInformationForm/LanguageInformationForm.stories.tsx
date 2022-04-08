import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { BasicForm } from "@common/components/form";
import { fakeUsers } from "@common/fakeData";
import { pick } from "lodash";
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
  return (
    <BasicForm
      onSubmit={async (data: FormValues) => {
        action("submit")(data);
      }}
      options={{
        defaultValues: dataToFormValues(args),
      }}
    >
      <LanguageInformationForm />
    </BasicForm>
  );
};

export const LanguageInfoForm = TemplateLangInfoForm.bind({});

LanguageInfoForm.args = {
  ...pick(fakeUsers()[1], [
    "lookingForEnglish",
    "lookingForFrench",
    "lookingForBilingual",
    "bilingualEvaluation",
    "comprehensionLevel",
    "writtenLevel",
    "verbalLevel",
    "estimatedLanguageAbility",
  ]),
};
