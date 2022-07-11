import React, { useState } from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button from "@common/components/Button";
import type { SubmitHandler } from "react-hook-form";
import OverlayOrDialogDecorator from "@common/../.storybook/decorators/OverlayOrDialogDecorator";
import { fakeSkills, fakePools, fakeClassifications } from "@common/fakeData";
import UserTableFilterDialog from "./UserTableFilterDialog";
import type { FormValues } from "./UserTableFilterDialog";
import useFilterOptions from "./useFilterOptions";

export default {
  title: "Users/UserTableFilterDialog",
  component: UserTableFilterDialog,
  decorators: [OverlayOrDialogDecorator],
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
} as ComponentMeta<typeof UserTableFilterDialog>;

const Template: ComponentStory<typeof UserTableFilterDialog> = (args) => {
  const { emptyFormValues } = useFilterOptions();
  const [activeFilters, setActiveFilters] =
    useState<FormValues>(emptyFormValues);
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    action("Update filter")(data);
    setActiveFilters(data);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Filters</Button>
      <UserTableFilterDialog
        {...{ isOpen, activeFilters }}
        {...args}
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export const Default = Template.bind({});

export const RandomLatency = Template.bind({});
RandomLatency.parameters = {
  apiResponsesConfig: {
    minTimeout: 2000,
    maxTimeout: 10000,
  },
  chromatic: { disableSnapshot: true },
};

export const WithEducationSelect = Template.bind({});
WithEducationSelect.args = {
  enableEducationType: true,
};
