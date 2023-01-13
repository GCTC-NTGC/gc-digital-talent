import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import pick from "lodash/pick";

import { fakeUsers } from "@common/fakeData";
import { UpdateUserAsUserInput } from "@common/api/generated";

import { LanguageInformationForm } from "./LanguageInformationForm";

export default {
  component: LanguageInformationForm,
  title: "Forms/Language Information Form",
} as Meta;

const TemplateLangInfoForm: Story = (args) => {
  const initialData = {
    id: "fakeId",
    ...args,
  };

  return (
    <LanguageInformationForm
      initialData={initialData}
      submitHandler={async (id: string, data: UpdateUserAsUserInput) => {
        action("Update Language Information")(id, data);
        return Promise.resolve(null);
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
