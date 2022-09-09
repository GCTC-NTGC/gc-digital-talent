import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { fakeUsers } from "@common/fakeData";
import { pick } from "lodash";
import { LanguageInformationForm } from "./LanguageInformationForm";

export default {
  component: LanguageInformationForm,
  title: "Language Information Form",
} as Meta;

const TemplateLangInfoForm: Story = (args) => {
  const initialData = {
    id: "fakeId",
    ...args,
  };

  return (
    <LanguageInformationForm
      initialData={initialData}
      submitHandler={async (id, data) => {
        action("Update Language Information")(id, data);
        return Promise.resolve(data);
      }}
    />
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
