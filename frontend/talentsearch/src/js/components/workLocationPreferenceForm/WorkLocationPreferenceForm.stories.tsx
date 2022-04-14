import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  UpdateUserAsUserInput,
  WorkLocationPreferenceQuery,
  WorkRegion,
} from "../../api/generated";
import { WorkLocationPreferenceForm } from "./WorkLocationPreferenceForm";

export default {
  component: WorkLocationPreferenceForm,
  title: "WorkLocationPreferenceForm",
} as Meta;

const mockUser: WorkLocationPreferenceQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "thanka11",
    locationPreferences: [WorkRegion.Atlantic],
    locationExemptions: "dagu",
  },
};

const TemplateWorkLocationPreferencesForm: Story = () => {
  return (
    <WorkLocationPreferenceForm
      initialData={mockUser}
      handleWorkLocationPreference={async (
        _: string,
        data: UpdateUserAsUserInput,
      ) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 1000);
        });
        action("Update About Me")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkLocationPreferences =
  TemplateWorkLocationPreferencesForm.bind({});
