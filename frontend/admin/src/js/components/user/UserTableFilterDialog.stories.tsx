import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import OverlayOrDialogDecorator from "@common/../.storybook/decorators/OverlayOrDialogDecorator";
import { fakeSkills, fakePools, fakeClassifications } from "@common/fakeData";
import UserTableFilterDialog from "./UserTableFilterDialog";

export default {
  title: "Users/UserTableFilterDialog.Button",
  component: UserTableFilterDialog.Button,
  decorators: [OverlayOrDialogDecorator],
  args: {
    isOpenDefault: true,
  },
  parameters: {
    apiResponses: {
      AllSkills: {
        data: {
          skills: fakeSkills(30),
        },
      },
      GetClassifications: {
        data: {
          classifications: fakeClassifications(),
        },
      },
      getPools: {
        data: {
          pools: fakePools(),
        },
      },
    },
  },
} as ComponentMeta<typeof UserTableFilterDialog.Button>;

const Template: ComponentStory<typeof UserTableFilterDialog.Button> = (
  args,
) => {
  return <UserTableFilterDialog.Button {...args} />;
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
