import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakePoolCandidates } from "@common/fakeData";
import { ApplicationStatusForm, type FormValues } from ".";

type Meta = ComponentMeta<typeof ApplicationStatusForm>;
type Story = ComponentStory<typeof ApplicationStatusForm>;

const mockApplications = fakePoolCandidates(1);

export default {
  component: ApplicationStatusForm,
  title: "Admin/Application Status Form",
} as Meta;

const Template: Story = (args) => {
  const { application } = args;

  const handleSubmit = async (id: string, values: FormValues) => {
    await action(JSON.stringify({ id, values }));
  };

  return (
    <ApplicationStatusForm application={application} onSubmit={handleSubmit} />
  );
};

export const FormWithData = Template.bind({});

FormWithData.args = {
  application: mockApplications[0],
};

export const FormNoData = Template.bind({});

FormWithData.args = {
  application: {
    status: null,
  },
};
