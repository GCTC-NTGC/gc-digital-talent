import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import type { SubmitHandler } from "react-hook-form";
import OverlayOrDialogDecorator from "@common/../.storybook/decorators/OverlayOrDialogDecorator";
import { fakeSkills, fakePools, fakeClassifications } from "@common/fakeData";
import UserTableFilterDialog from "./UserTableFilterDialog";
import type { FormValues } from "./UserTableFilterDialog";

export default {
  title: "Users/UserTableFilters",
  component: UserTableFilterDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    isOpenDefault: true,
  },
  parameters: {
    apiResponses: {
      getFilterData: {
        data: {
          classifications: fakeClassifications(),
          pools: fakePools(),
          skills: fakeSkills(30),
        },
      },
    },
  },
} as ComponentMeta<typeof UserTableFilterDialog>;

const Template: ComponentStory<typeof UserTableFilterDialog> = (args) => {
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

export const WithEducationSelect = Template.bind({});
WithEducationSelect.args = {
  enableEducationType: true,
};
