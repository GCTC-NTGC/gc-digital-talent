import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import type { SubmitHandler } from "react-hook-form";

import { OverlayOrDialogDecorator } from "storybook-helpers";
import {
  fakeSkills,
  fakePools,
  fakeClassifications,
} from "@gc-digital-talent/fake-data";

import PoolCandidateTableFilterDialog from "./PoolCandidateTableFilterDialog";
import type { FormValues } from "./PoolCandidateTableFilterDialog";

export default {
  title: "Components/Pool Candidate Table Filter Dialog",
  component: PoolCandidateTableFilterDialog,
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
        },
      },
    },
  },
} as ComponentMeta<typeof PoolCandidateTableFilterDialog>;

const Template: ComponentStory<typeof PoolCandidateTableFilterDialog> = (
  args,
) => {
  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    action("Update filter")(data);
  };

  return <PoolCandidateTableFilterDialog {...args} onSubmit={handleSubmit} />;
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
