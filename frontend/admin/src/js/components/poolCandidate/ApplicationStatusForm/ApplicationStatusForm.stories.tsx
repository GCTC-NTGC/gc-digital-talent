import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakePoolCandidates } from "@common/fakeData";
import { UpdatePoolCandidateAsAdminInput } from "admin/src/js/api/generated";
import {
  ApplicationStatusForm,
  type FormValues,
} from "./ApplicationStatusForm";

type Meta = ComponentMeta<typeof ApplicationStatusForm>;
type Story = ComponentStory<typeof ApplicationStatusForm>;

const mockApplications = fakePoolCandidates(1);
const mockApplication = mockApplications[0];

export default {
  component: ApplicationStatusForm,
  title: "Admin/Application Status Form",
} as Meta;

const Template: Story = (args) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const { application } = args;

  const handleSubmit = (values: UpdatePoolCandidateAsAdminInput) => {
    action(JSON.stringify({ values }));
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: "30rem" }}>
      <ApplicationStatusForm
        isSubmitting={isSubmitting}
        application={application}
        onSubmit={handleSubmit}
      />
    </div>
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
