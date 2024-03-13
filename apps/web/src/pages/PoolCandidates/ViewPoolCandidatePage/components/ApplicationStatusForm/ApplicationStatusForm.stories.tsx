import React from "react";
import type { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { UpdatePoolCandidateStatusInput } from "@gc-digital-talent/graphql";

import { ApplicationStatusForm } from "./ApplicationStatusForm";

type Story = StoryFn<typeof ApplicationStatusForm>;

const mockApplications = fakePoolCandidates(1);
const mockApplication = mockApplications[0];

export default {
  component: ApplicationStatusForm,
  title: "Forms/Application Status Form",
} as Meta;

const Template: Story = (args) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const { application } = args;

  const handleSubmit = (values: UpdatePoolCandidateStatusInput) => {
    action(JSON.stringify({ values }));
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  return (
    <ApplicationStatusForm
      isSubmitting={isSubmitting}
      application={application}
      onSubmit={handleSubmit}
    />
  );
};

export const FormWithData = Template.bind({});

FormWithData.args = {
  application: mockApplication,
};

export const FormNoData = Template.bind({});

FormNoData.args = {
  application: {
    ...mockApplication,
    status: undefined,
    expiryDate: undefined,
    notes: "",
  },
};
