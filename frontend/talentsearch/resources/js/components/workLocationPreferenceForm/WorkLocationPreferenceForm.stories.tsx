import React from "react";
import { Meta, storiesOf, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import {
  CreateUserInput,
  Language,
  UpdateUserAsUserInput,
  User,
  WorkRegion,
} from "../../api/generated";
import {
  FormValues,
  WorkLocationPreferenceForm,
} from "./WorkLocationPreferenceForm";

export default {
  component: WorkLocationPreferenceForm,
  title: "WorkLocationPreferenceForm",
} as Meta;

const user: User = {
  id: "1",
  firstName: "Maura",
  lastName: "Attow",
  email: "mattow0@ning.com",
  telephone: "+867365373244",
  preferredLang: Language.En,
};

const TemplateWorkLocationPreferencesForm: Story = () => {
  return (
    <WorkLocationPreferenceForm
      initialData={user}
      handleWorkLocationPreference={async (id: string, data: FormValues) => {
        action("submit")(data);
      }}
    />
  );
};

export const IndividualWorkLocationPreferences =
  TemplateWorkLocationPreferencesForm.bind({});
