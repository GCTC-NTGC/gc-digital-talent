import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { fakeUsers } from "@common/fakeData";
import { pick } from "lodash";
import { UpdateUserAsUserInput } from "@common/api/generated";
import { LanguageInformationForm } from "./LanguageInformationForm";

export default {
  component: LanguageInformationForm,
  title: "Language Information Form",
} as Meta;

const TemplateLangInfoForm: Story = (args) => {
  const initialData = {
    me: {
      id: "fakeId",
      ...args,
    },
  };

  return (
    <LanguageInformationForm
      initialData={initialData}
      onUpdateLanguageInformation={async (
        _: string,
        data: UpdateUserAsUserInput,
      ) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 1000);
        });
        action("Update Language Information")(data);
        return null;
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
