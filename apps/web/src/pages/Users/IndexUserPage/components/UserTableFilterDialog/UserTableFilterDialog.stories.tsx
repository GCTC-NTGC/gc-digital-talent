import React from "react";
import type { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import type { SubmitHandler } from "react-hook-form";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  fakeSkills,
  fakePools,
  fakeClassifications,
  fakeRoles,
} from "@gc-digital-talent/fake-data";

import UserTableFilterDialog from "./UserTableFilterDialog";
import type { FormValues } from "./UserTableFilterDialog";

export default {
  title: "Components/User Table Filters",
  component: UserTableFilterDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    isOpenDefault: true,
  },
  parameters: {
    themeKey: "admin",
    apiResponses: {
      getFilterData: {
        data: {
          classifications: fakeClassifications(),
          pools: fakePools(),
          skills: fakeSkills(30),
          roles: fakeRoles(),
        },
      },
    },
  },
} as Meta<typeof UserTableFilterDialog>;

const Template: StoryFn<typeof UserTableFilterDialog> = (args) => {
  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    action("Update filter")(data);
  };

  return <UserTableFilterDialog {...args} onSubmit={handleSubmit} />;
};

export const Default = Template.bind({});

export const RandomLatency = Template.bind({});
RandomLatency.parameters = {
  apiResponsesConfig: {
    latency: {
      min: 2000,
      max: 10000,
    },
  },
  chromatic: { disableSnapshot: true },
};
