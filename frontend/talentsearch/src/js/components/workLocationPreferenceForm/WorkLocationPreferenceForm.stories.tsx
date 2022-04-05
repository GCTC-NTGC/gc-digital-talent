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
      handleWorkLocationPreference={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Work Location Preference")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkLocationPreferences =
  TemplateWorkLocationPreferencesForm.bind({});
